-- MiGlobo · Funciones que llama n8n
-- n8n las llama por HTTP: POST {SUPABASE_URL}/rest/v1/rpc/<funcion>
-- con el header  apikey: <secret key>.  Solo service_role puede ejecutarlas.

-- 1) Llega un mensaje de WhatsApp: encuentra el negocio, crea/actualiza
--    el cliente y guarda el mensaje. Devuelve el catálogo para dárselo a la IA.
create function public.registrar_mensaje_whatsapp(
  p_phone_number_id text,
  p_wa_id text,
  p_nombre text,
  p_texto text,
  p_mensaje_id text
) returns jsonb
language plpgsql set search_path = '' as $$
declare
  v_negocio uuid;
  v_cliente uuid;
  v_mensaje uuid;
begin
  select id into v_negocio
  from public.negocios
  where whatsapp_phone_number_id = p_phone_number_id;

  if v_negocio is null then
    return jsonb_build_object('ok', false, 'error', 'negocio_no_encontrado');
  end if;

  insert into public.clientes (negocio_id, canal, canal_usuario_id, nombre, telefono)
  values (v_negocio, 'whatsapp', p_wa_id, p_nombre, p_wa_id)
  on conflict (negocio_id, canal, canal_usuario_id)
    do update set nombre = coalesce(excluded.nombre, public.clientes.nombre)
  returning id into v_cliente;

  -- Meta reintenta webhooks: si ya teníamos este mensaje, no lo duplicamos.
  insert into public.mensajes (negocio_id, cliente_id, canal, direccion, texto, canal_mensaje_id)
  values (v_negocio, v_cliente, 'whatsapp', 'entrante', p_texto, p_mensaje_id)
  on conflict (canal_mensaje_id) do nothing
  returning id into v_mensaje;

  if v_mensaje is null then
    return jsonb_build_object('ok', false, 'error', 'duplicado');
  end if;

  return jsonb_build_object(
    'ok', true,
    'negocio_id', v_negocio,
    'cliente_id', v_cliente,
    'mensaje_id', v_mensaje,
    'catalogo', (
      select coalesce(jsonb_agg(jsonb_build_object('nombre', nombre, 'precio', precio)), '[]'::jsonb)
      from public.productos
      where negocio_id = v_negocio and activo
    )
  );
end;
$$;

-- 2) Guarda lo que la IA entendió del mensaje (pregunta, pago, otro...).
create function public.clasificar_mensaje(p_mensaje_id uuid, p_intencion text)
returns void
language sql set search_path = '' as $$
  update public.mensajes set intencion = p_intencion where id = p_mensaje_id;
$$;

-- 3) La IA detectó un pedido. p_items = [{"nombre": "brownie", "cantidad": 2}, ...]
--    Busca cada producto por nombre parecido; si no lo encuentra, lo deja con precio 0
--    para que el vendedor lo revise.
create function public.registrar_pedido_ia(
  p_mensaje_id uuid,
  p_items jsonb,
  p_notas text default null,
  p_lugar text default null,
  p_fecha_hora timestamptz default null
) returns uuid
language plpgsql set search_path = '' as $$
declare
  v_msg public.mensajes;
  v_pedido uuid;
  v_item jsonb;
  v_producto public.productos;
begin
  select * into v_msg from public.mensajes where id = p_mensaje_id;
  if v_msg.id is null then
    raise exception 'Mensaje % no existe', p_mensaje_id;
  end if;

  insert into public.pedidos (negocio_id, cliente_id, origen, mensaje_id, notas)
  values (v_msg.negocio_id, v_msg.cliente_id, 'ia', v_msg.id, p_notas)
  returning id into v_pedido;

  for v_item in select * from jsonb_array_elements(coalesce(p_items, '[]'::jsonb)) loop
    select * into v_producto
    from public.productos
    where negocio_id = v_msg.negocio_id
      and activo
      and (nombre ilike '%' || (v_item ->> 'nombre') || '%'
           or (v_item ->> 'nombre') ilike '%' || nombre || '%')
    order by length(nombre)
    limit 1;

    insert into public.pedido_items (pedido_id, producto_id, descripcion, cantidad, precio_unitario)
    values (
      v_pedido,
      v_producto.id,
      coalesce(v_producto.nombre, v_item ->> 'nombre'),
      greatest(coalesce((v_item ->> 'cantidad')::int, 1), 1),
      coalesce(v_producto.precio, 0)
    );
  end loop;

  update public.pedidos
  set total = (
    select coalesce(sum(cantidad * precio_unitario), 0)
    from public.pedido_items where pedido_id = v_pedido
  )
  where id = v_pedido;

  if p_lugar is not null and p_fecha_hora is not null then
    insert into public.entregas (pedido_id, lugar, fecha_hora)
    values (v_pedido, p_lugar, p_fecha_hora);
  end if;

  update public.mensajes set intencion = 'pedido' where id = v_msg.id;

  return v_pedido;
end;
$$;

-- 4) Guarda la respuesta que n8n mandó por WhatsApp, para verla en el panel.
create function public.registrar_respuesta(p_mensaje_id uuid, p_texto text, p_canal_mensaje_id text default null)
returns void
language sql set search_path = '' as $$
  insert into public.mensajes (negocio_id, cliente_id, canal, direccion, texto, canal_mensaje_id, atendido)
  select negocio_id, cliente_id, canal, 'saliente', p_texto, p_canal_mensaje_id, true
  from public.mensajes where id = p_mensaje_id;
$$;

-- Solo n8n (service_role) puede llamarlas. Supabase da EXECUTE a todos por defecto.
revoke execute on function
  public.registrar_mensaje_whatsapp(text, text, text, text, text),
  public.clasificar_mensaje(uuid, text),
  public.registrar_pedido_ia(uuid, jsonb, text, text, timestamptz),
  public.registrar_respuesta(uuid, text, text)
from public, anon, authenticated;

grant execute on function
  public.registrar_mensaje_whatsapp(text, text, text, text, text),
  public.clasificar_mensaje(uuid, text),
  public.registrar_pedido_ia(uuid, jsonb, text, text, timestamptz),
  public.registrar_respuesta(uuid, text, text)
to service_role;
