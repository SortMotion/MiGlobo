-- MiGlobo · Borra los datos de prueba que agregó seed.sql
-- Solo toca lo de ejemplo: clientes con canal_usuario_id 'demo-…' y los productos del seed.

-- Pedidos de clientes demo (borra también sus productos, pagos y entregas).
delete from public.pedidos
where cliente_id in (select id from public.clientes where canal_usuario_id like 'demo-%');

-- Clientes demo (borra también sus mensajes).
delete from public.clientes where canal_usuario_id like 'demo-%';

-- Productos de ejemplo.
delete from public.productos
where nombre in ('Brownie', 'Galletas (paquete de 6)', 'Pay de limón')
  and descripcion in ('Brownie de chocolate con nuez', 'Chispas de chocolate', 'Solo por encargo');
