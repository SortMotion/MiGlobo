# Roadmap

El tablero ([Project MiGlobo](https://github.com/orgs/SortMotion/projects/3)) solo lleva
**tareas de código y configuración técnica**. Cada tarea es un Issue con responsable,
prioridad y puntos de esfuerzo.

El reparto se define en [`scripts/backlog.mjs`](../scripts/backlog.mjs). Si cambia, se
actualiza ahí y se vuelve a correr `node scripts/crear-backlog.mjs`.

## Reparto

Puntos de esfuerzo: 1 = un rato · 2 = un día · 3 = unos días · 5 = una semana.
Lo más complejo (integraciones y módulos centrales) está entre Adriel y Andy.

| Rol | Quién | Área | Puntos abiertos |
|---|---|---|---|
| Adriel · Web | Adriel ([@ByiDray](https://github.com/ByiDray)) | Conversaciones, responder desde el panel, pedidos a mano (RF-33a/b/c), entregas, comprobantes | 29 |
| Andy · Automatización e IA | Andy ([@andyPlazaCardenas](https://github.com/andyPlazaCardenas)) | Meta/WhatsApp, n8n, prompt de IA, pedido por IA de punta a punta, resumen de ventas | 32 (8 son configuración) |
| Diego · Datos, evaluación y UI | Diego ([@diegohdez100106-ya](https://github.com/diegohdez100106-ya)) | Anticipos, clientes, filtros y CSV, productos, pantallas sencillas del panel, Vercel | 28 |

## Hecho

- [x] #1 Configurar repo · Adriel
- [x] #2 Supabase + migraciones · Diego
- [x] #3 Cada integrante corre la web · todos

## Integración WhatsApp + IA · Andy

- [ ] #4 App de Meta + número de prueba ([`whatsapp.md`](whatsapp.md))
- [ ] #5 n8n + túnel y primer webhook
- [ ] #12 Flujo `whatsapp-entrante` exportado a `n8n/workflows/`
- [ ] #13 Probar el prompt y medir su precisión
- [ ] #18 RF-30 Pedido por IA de punta a punta
- [ ] #26 n8n en servidor fijo

## Panel · mínimo para la demo

- [ ] #19 RF-33 Pedidos a mano · issue padre de:
  - [ ] #40 RF-33a Detalle del pedido · Adriel
  - [ ] #41 RF-33b Crear pedido a mano · Adriel
  - [ ] #42 RF-33c Editar productos del pedido · Adriel
  - [ ] #43 RF-33d Cancelar pedido · Diego
- [ ] #17 RF-21 Mensajes por conversación · Adriel
- [ ] #22 RF-50 Programar entrega · Adriel
- [ ] #16 Errores en formularios · Adriel
- [ ] #14 Revisar el modelo de datos · Adriel
- [ ] #20 RF-40 Registrar anticipos · Diego
- [ ] #21 RF-42 Verificar pagos · Diego
- [ ] #23 RF-52 Marcar entregas realizadas · Diego
- [ ] #15 RF-03 Editar negocio y conectar WhatsApp · Diego
- [ ] #24 Revisión del panel en celular · Diego
- [ ] #25 Desplegar la web en Vercel · Diego

## Deseables

- Adriel: #28 RF-22 responder desde el panel, #31 RF-41 comprobantes
- Andy: #44 RF-80 resumen de ventas, #29 RF-23 respuestas automáticas, #32 RF-53 recordatorios
- Diego: #45 RF-70 clientes, #46 RF-35 filtros, #47 RF-36 exportar CSV, #27 RF-11 productos, #30 RF-34 mensaje de origen, #33 tipos generados

#34 Instagram/Facebook queda para después.

## Dependencias a cuidar

- #40 (detalle del pedido) va primero: #41, #42, #43, #20 y #22 se apoyan en esa pantalla.
- Andy necesita #4 y #5 antes de #12 y #18.
- #47 (CSV) respeta los filtros de #46; conviene hacerlos en ese orden.
- #44 (resumen de ventas) cuenta solo pagos verificados (#21).

## Fuera del tablero

Entrevistas, línea base, pruebas de campo, reporte y demo (objetivos 1 y 4) siguen
siendo parte del proyecto escolar, pero ya no se rastrean como issues. Las guías
están en [`requerimientos.md`](requerimientos.md) y [`evaluacion.md`](evaluacion.md);
los issues cerrados (#6–#11, #35–#39) se pueden reabrir si hace falta.
