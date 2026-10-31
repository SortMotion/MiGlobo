# Roadmap

Organizado por los objetivos particulares. Cada tarea es un **Issue** en GitHub y está
en el [Project MiGlobo](https://github.com/orgs/SortMotion/projects/3), con su
responsable, prioridad y puntos de esfuerzo.

El reparto se define en [`scripts/backlog.mjs`](../scripts/backlog.mjs). Si cambia, se
actualiza ahí y se vuelve a correr `node scripts/crear-backlog.mjs`.

## Reparto

Puntos de esfuerzo: 1 = un rato · 2 = un día · 3 = unos días · 5 = una semana · 8 = lo más grande.
Lo más complejo (integraciones y módulos centrales) está entre Adriel y Andy.

| Rol | Quién | Área | Puntos | Mínimo demo |
|---|---|---|---|---|
| Adriel · Web | Adriel ([@ByiDray](https://github.com/ByiDray)) | Configuración del repo; módulos centrales del panel: pedidos, conversaciones, respuestas, pagos y entregas, Storage | 32 | 24 |
| Andy · Automatización e IA | Andy ([@andyPlazaCardenas](https://github.com/andyPlazaCardenas)) | Meta/WhatsApp, n8n, prompt de IA, pedido por IA de punta a punta, despliegue de n8n | 30 | 24 |
| Diego · Datos, evaluación y UI | Diego ([@diegohdez100106-ya](https://github.com/diegohdez100106-ya)) | Supabase, análisis y evaluación, bocetos, pantallas sencillas del panel, Vercel | 28 | 23 |

Las tareas **compartidas** (16 pts) son de los tres; el responsable las organiza:

| Issue | Responsable |
|---|---|
| #3 Cada integrante corre la web | Adriel |
| #6 Entrevistas | Andy |
| #35 Alta de emprendedores de prueba | Diego |
| #36 Periodo de uso real | Diego |
| #38 Reporte de resultados | Andy |
| #39 Demo final | Adriel |

## Fase 0 · Arranque

- [ ] #1 Configurar repo: proteger `main` e invitar al equipo · Adriel
- [ ] #2 Proyecto de Supabase + migraciones ([`supabase.md`](supabase.md)) · Diego
- [ ] #3 Cada integrante corre la web · todos
- [ ] #4 App de Meta + número de prueba de WhatsApp ([`whatsapp.md`](whatsapp.md)) · Andy
- [ ] #5 n8n + túnel y primer webhook · Andy

## Fase 1 · Análisis (objetivo 1)

- [ ] #6 Entrevistar a 3–5 emprendedores ([`requerimientos.md`](requerimientos.md)) · todos
- [ ] #7 Ajustar requerimientos con las entrevistas · Diego
- [ ] #8 Viabilidad técnica de conectar las redes · Andy
- [ ] #9 Decidir cómo se manejan los pagos · Diego
- [ ] #10 Línea base para la evaluación ([`evaluacion.md`](evaluacion.md)) · Diego

## Fase 2 · Diseño (objetivo 2)

- [ ] #11 Bocetos de las pantallas en celular · Diego
- [ ] #12 Flujo `whatsapp-entrante` exportado a `n8n/workflows/` · Andy
- [ ] #13 Probar el prompt de la IA y medir su precisión · Andy
- [ ] #14 Revisar el modelo de datos · Adriel

## Fase 3 · Desarrollo (objetivo 3)

Mínimo para la demo:

- [ ] #19 RF-33 Crear / editar / cancelar pedidos · Adriel
- [ ] #17 RF-21 Mensajes por conversación · Adriel
- [ ] #20 RF-40 Registrar anticipos · Adriel
- [ ] #22 RF-50 Programar entrega · Adriel
- [ ] #16 Errores en formularios · Adriel
- [ ] #18 RF-30 Pedido por IA de punta a punta · Andy
- [ ] #26 n8n en servidor fijo · Andy
- [ ] #15 RF-03 Editar negocio y conectar WhatsApp · Diego
- [ ] #21 RF-42 Verificar pagos · Diego
- [ ] #23 RF-52 Marcar entregas realizadas · Diego
- [ ] #24 Revisión del panel en celular · Diego
- [ ] #25 Desplegar la web en Vercel · Diego

Si da tiempo: #28 RF-22 responder desde el panel y #31 RF-41 comprobantes (Adriel);
#29 RF-23 respuestas automáticas y #32 RF-53 recordatorios (Andy); #27 RF-11 productos,
#30 RF-34 mensaje de origen y #33 tipos generados (Diego). #34 Instagram/Facebook queda
para después.

## Fase 4 · Evaluación (objetivo 4)

- [ ] #35 Dar de alta a los emprendedores de prueba · todos
- [ ] #36 1–2 semanas de uso real · todos
- [ ] #37 Medición final, SUS y precisión de la IA · Diego
- [ ] #38 Reporte de resultados · todos
- [ ] #39 Demo final · todos

## Dependencias a cuidar

- Adriel puede empezar #19 y #17 desde ya; no dependen del análisis.
- Andy necesita #2 (Supabase, Diego) antes de #12 y #18.
- Diego puede hacer #21 y #23 sobre las listas que ya existen; no necesita esperar #20 ni #22.
