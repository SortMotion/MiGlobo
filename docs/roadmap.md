# Roadmap

Organizado por los objetivos particulares. Cada tarea se vuelve un **Issue** en GitHub
(ver [`../CONTRIBUTING.md`](../CONTRIBUTING.md)) con su ID de requerimiento.

## Roles sugeridos

Todos programan y todos entrevistan. Cada quien es **dueño** de un área, o sea, la
persona que la revisa y responde por ella:

| Rol | Área | Asignado a |
|---|---|---|
| **A · Web** | Panel, página pública, diseño en celular | |
| **B · Automatización** | Meta/WhatsApp, n8n, prompt de IA | |
| **C · Datos y evaluación** | Supabase (migraciones, RLS), pruebas de campo, documentación | |

## Fase 0 · Arranque (semana 1)

- [ ] Crear repo en GitHub, invitar al equipo, proteger `main` (C)
- [ ] Proyecto de Supabase + migraciones + invitar al equipo ([`supabase.md`](supabase.md)) (C)
- [ ] Todos: clonar, `npm install`, correr la web y crear su cuenta de prueba
- [ ] App de Meta + número de prueba de WhatsApp ([`whatsapp.md`](whatsapp.md)) (B)
- [ ] Levantar n8n + túnel y recibir el primer webhook (B)

## Fase 1 · Análisis (objetivo 1)

- [ ] Entrevistar a 3–5 emprendedores con la guía de [`requerimientos.md`](requerimientos.md) (todos)
- [ ] Ajustar prioridades de requerimientos con lo que digan (C)
- [ ] Documentar viabilidad: qué permite Meta con número de prueba vs. números reales (B)
- [ ] Medir la línea base para la evaluación ([`evaluacion.md`](evaluacion.md)) (C)

## Fase 2 · Diseño (objetivo 2)

- [ ] Bocetos de las pantallas en celular: mensajes, pedido, registrar anticipo (A)
- [ ] Flujo `whatsapp-entrante` armado y exportado a `n8n/workflows/` (B)
- [ ] Revisar el modelo de datos con lo que salió en las entrevistas (C)

## Fase 3 · Desarrollo (objetivo 3)

Mínimo para la demo (prioridad **M**):

- [ ] RF-03 Editar negocio y guardar el *phone number id* de WhatsApp (A)
- [ ] RF-21 Mensajes agrupados por conversación (A)
- [ ] RF-30 Pedido creado por IA de punta a punta: WhatsApp → n8n → panel (B)
- [ ] RF-33 Crear / editar / cancelar pedido a mano (A)
- [ ] RF-40 / RF-42 Registrar y verificar anticipos (C)
- [ ] RF-50 / RF-52 Programar entrega y marcarla realizada (C)
- [ ] Desplegar web en Vercel y n8n en un servidor fijo (B)

Si da tiempo (**D**): respuestas automáticas (RF-23), comprobantes (RF-41),
recordatorios (RF-53), fotos de productos (RF-11).

## Fase 4 · Evaluación (objetivo 4)

- [ ] Dar de alta a los emprendedores de prueba y acompañarlos el primer día (todos)
- [ ] 1–2 semanas de uso real
- [ ] Medición "después", cuestionario SUS y precisión de la IA (C)
- [ ] Reporte de resultados y demo final (todos)
