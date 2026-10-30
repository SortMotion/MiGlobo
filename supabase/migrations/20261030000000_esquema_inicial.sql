-- MiGlobo · Esquema inicial
-- Cómo correrlo: Supabase Dashboard → SQL Editor → pegar y ejecutar
-- (o con la CLI: npx supabase db push, ver docs/supabase.md).

-- ─── Tipos ────────────────────────────────────────────────────────────
create type public.canal_tipo as enum ('whatsapp', 'instagram', 'facebook', 'web');
create type public.mensaje_direccion as enum ('entrante', 'saliente');
create type public.pedido_estado as enum ('pendiente', 'confirmado', 'listo', 'entregado', 'cancelado');
create type public.pedido_origen as enum ('manual', 'ia');
create type public.pago_tipo as enum ('anticipo', 'liquidacion');
create type public.pago_metodo as enum ('efectivo', 'transferencia', 'otro');
create type public.entrega_estado as enum ('programada', 'realizada', 'cancelada');

-- ─── Tablas ───────────────────────────────────────────────────────────

-- Un emprendimiento. Por ahora cada usuario tiene uno.
create table public.negocios (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nombre text not null,
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,40}$'),
  descripcion text,
  -- Número público para el botón "Escríbenos" (solo dígitos, con lada: 5213312345678).
  whatsapp_numero text,
  -- Identificador que Meta manda en cada webhook; n8n lo usa para saber de qué negocio es el mensaje.
  whatsapp_phone_number_id text unique,
  created_at timestamptz not null default now()
);

create table public.productos (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references public.negocios (id) on delete cascade,
  nombre text not null,
  descripcion text,
  precio numeric(10, 2) not null check (precio >= 0),
  foto_url text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- Compradores. Se crean solos cuando llega el primer mensaje.
create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references public.negocios (id) on delete cascade,
  nombre text,
  canal public.canal_tipo not null,
  -- wa_id de WhatsApp, IGSID de Instagram, etc.
  canal_usuario_id text not null,
  telefono text,
  created_at timestamptz not null default now(),
  unique (negocio_id, canal, canal_usuario_id)
);

create table public.mensajes (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references public.negocios (id) on delete cascade,
  cliente_id uuid not null references public.clientes (id) on delete cascade,
  canal public.canal_tipo not null,
  direccion public.mensaje_direccion not null,
  texto text,
  -- ID del mensaje en la red social. Unique para ignorar webhooks repetidos.
  canal_mensaje_id text unique,
  -- Lo que la IA cree que es: 'pedido', 'pregunta', 'pago', 'entrega', 'otro'.
  intencion text,
  atendido boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.pedidos (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references public.negocios (id) on delete cascade,
  cliente_id uuid references public.clientes (id) on delete set null,
  estado public.pedido_estado not null default 'pendiente',
  origen public.pedido_origen not null default 'manual',
  -- Mensaje del que la IA sacó el pedido (para revisarlo).
  mensaje_id uuid references public.mensajes (id) on delete set null,
  total numeric(10, 2) not null default 0 check (total >= 0),
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pedido_items (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos (id) on delete cascade,
  producto_id uuid references public.productos (id) on delete set null,
  descripcion text not null,
  cantidad integer not null default 1 check (cantidad > 0),
  precio_unitario numeric(10, 2) not null default 0 check (precio_unitario >= 0)
);

-- Anticipos y liquidaciones.
create table public.pagos (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos (id) on delete cascade,
  monto numeric(10, 2) not null check (monto > 0),
  tipo public.pago_tipo not null default 'anticipo',
  metodo public.pago_metodo not null default 'transferencia',
  comprobante_url text,
  verificado boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.entregas (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos (id) on delete cascade,
  lugar text not null,
  fecha_hora timestamptz not null,
  estado public.entrega_estado not null default 'programada',
  notas text,
  created_at timestamptz not null default now()
);

create index on public.productos (negocio_id);
create index on public.mensajes (negocio_id, created_at desc);
create index on public.pedidos (negocio_id, estado);
create index on public.pagos (pedido_id);
create index on public.entregas (pedido_id);
create index on public.entregas (fecha_hora);

-- ─── updated_at automático ────────────────────────────────────────────
create function public.tocar_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger pedidos_updated_at
  before update on public.pedidos
  for each row execute function public.tocar_updated_at();

-- ─── Vista: pedido con lo pagado y lo que falta ───────────────────────
create view public.pedidos_resumen with (security_invoker = true) as
select
  p.*,
  c.nombre as cliente_nombre,
  coalesce(sum(pg.monto) filter (where pg.verificado), 0) as pagado,
  p.total - coalesce(sum(pg.monto) filter (where pg.verificado), 0) as saldo
from public.pedidos p
left join public.clientes c on c.id = p.cliente_id
left join public.pagos pg on pg.pedido_id = p.id
group by p.id, c.nombre;

-- ─── Seguridad (RLS) ──────────────────────────────────────────────────
-- Cada emprendedor solo ve lo de su negocio. n8n usa la secret key,
-- que se salta RLS, así que nunca debe ir al navegador.

create function public.es_mi_negocio(nid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.negocios
    where id = nid and owner_id = (select auth.uid())
  );
$$;

alter table public.negocios enable row level security;
alter table public.productos enable row level security;
alter table public.clientes enable row level security;
alter table public.mensajes enable row level security;
alter table public.pedidos enable row level security;
alter table public.pedido_items enable row level security;
alter table public.pagos enable row level security;
alter table public.entregas enable row level security;

-- Negocios: públicos para leer (página de la tienda), editables solo por su dueño.
create policy "negocios: lectura pública" on public.negocios
  for select using (true);
create policy "negocios: el dueño crea" on public.negocios
  for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "negocios: el dueño edita" on public.negocios
  for update to authenticated using (owner_id = (select auth.uid()));
create policy "negocios: el dueño borra" on public.negocios
  for delete to authenticated using (owner_id = (select auth.uid()));

-- Productos activos: públicos. Todo lo demás, solo el dueño.
create policy "productos: lectura pública de activos" on public.productos
  for select using (activo);
create policy "productos: el dueño administra" on public.productos
  for all to authenticated
  using (public.es_mi_negocio(negocio_id))
  with check (public.es_mi_negocio(negocio_id));

create policy "clientes: el dueño administra" on public.clientes
  for all to authenticated
  using (public.es_mi_negocio(negocio_id))
  with check (public.es_mi_negocio(negocio_id));

create policy "mensajes: el dueño administra" on public.mensajes
  for all to authenticated
  using (public.es_mi_negocio(negocio_id))
  with check (public.es_mi_negocio(negocio_id));

create policy "pedidos: el dueño administra" on public.pedidos
  for all to authenticated
  using (public.es_mi_negocio(negocio_id))
  with check (public.es_mi_negocio(negocio_id));

create policy "pedido_items: el dueño administra" on public.pedido_items
  for all to authenticated
  using (exists (select 1 from public.pedidos p where p.id = pedido_id and public.es_mi_negocio(p.negocio_id)))
  with check (exists (select 1 from public.pedidos p where p.id = pedido_id and public.es_mi_negocio(p.negocio_id)));

create policy "pagos: el dueño administra" on public.pagos
  for all to authenticated
  using (exists (select 1 from public.pedidos p where p.id = pedido_id and public.es_mi_negocio(p.negocio_id)))
  with check (exists (select 1 from public.pedidos p where p.id = pedido_id and public.es_mi_negocio(p.negocio_id)));

create policy "entregas: el dueño administra" on public.entregas
  for all to authenticated
  using (exists (select 1 from public.pedidos p where p.id = pedido_id and public.es_mi_negocio(p.negocio_id)))
  with check (exists (select 1 from public.pedidos p where p.id = pedido_id and public.es_mi_negocio(p.negocio_id)));

-- Permisos explícitos para la Data API (por si el proyecto no los da por defecto).
grant usage on schema public to anon, authenticated, service_role;
grant select on public.negocios, public.productos to anon;
grant select, insert, update, delete on all tables in schema public to authenticated, service_role;

-- ─── Tiempo real ──────────────────────────────────────────────────────
-- Para que el panel vea mensajes y pedidos nuevos sin recargar.
alter publication supabase_realtime add table public.mensajes, public.pedidos;
