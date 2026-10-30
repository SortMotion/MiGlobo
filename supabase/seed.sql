-- MiGlobo · Datos de prueba
-- Antes de correrlo: regístrate en la app (/login) y crea tu negocio en /panel.
-- Este script agrega productos, clientes, mensajes y pedidos de ejemplo
-- al negocio más reciente. Se puede correr varias veces.

do $$
declare
  nid uuid;
  c1 uuid;
  c2 uuid;
  m1 uuid;
  p1 uuid;
  p2 uuid;
  brownie uuid;
  galletas uuid;
begin
  select id into nid from public.negocios order by created_at desc limit 1;
  if nid is null then
    raise exception 'No hay negocios. Crea uno desde /panel primero.';
  end if;

  insert into public.productos (negocio_id, nombre, descripcion, precio)
  values (nid, 'Brownie', 'Brownie de chocolate con nuez', 35)
  returning id into brownie;
  insert into public.productos (negocio_id, nombre, descripcion, precio)
  values (nid, 'Galletas (paquete de 6)', 'Chispas de chocolate', 50)
  returning id into galletas;
  insert into public.productos (negocio_id, nombre, descripcion, precio, activo)
  values (nid, 'Pay de limón', 'Solo por encargo', 180, false);

  insert into public.clientes (negocio_id, nombre, canal, canal_usuario_id, telefono)
  values (nid, 'Andrea', 'whatsapp', 'demo-' || gen_random_uuid(), '5213300000001')
  returning id into c1;
  insert into public.clientes (negocio_id, nombre, canal, canal_usuario_id)
  values (nid, 'Luis', 'instagram', 'demo-' || gen_random_uuid())
  returning id into c2;

  insert into public.mensajes (negocio_id, cliente_id, canal, direccion, texto, intencion)
  values (nid, c1, 'whatsapp', 'entrante',
          'Hola! me apartas 2 brownies para mañana en la biblioteca a las 12?', 'pedido')
  returning id into m1;
  insert into public.mensajes (negocio_id, cliente_id, canal, direccion, texto, intencion)
  values (nid, c2, 'instagram', 'entrante', '¿Todavía tienes galletas?', 'pregunta');

  insert into public.pedidos (negocio_id, cliente_id, estado, origen, mensaje_id, total)
  values (nid, c1, 'confirmado', 'ia', m1, 70)
  returning id into p1;
  insert into public.pedido_items (pedido_id, producto_id, descripcion, cantidad, precio_unitario)
  values (p1, brownie, 'Brownie', 2, 35);
  insert into public.pagos (pedido_id, monto, tipo, metodo, verificado)
  values (p1, 35, 'anticipo', 'transferencia', true);
  insert into public.entregas (pedido_id, lugar, fecha_hora)
  values (p1, 'Biblioteca, entrada principal', date_trunc('day', now()) + interval '1 day 12 hours');

  insert into public.pedidos (negocio_id, cliente_id, total, notas)
  values (nid, c2, 100, 'Pidió por DM, falta confirmar punto de entrega')
  returning id into p2;
  insert into public.pedido_items (pedido_id, producto_id, descripcion, cantidad, precio_unitario)
  values (p2, galletas, 'Galletas (paquete de 6)', 2, 50);
end $$;
