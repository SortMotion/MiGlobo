// Backlog inicial de MiGlobo. Lo usa scripts/crear-backlog.mjs para crear los issues.
// Basado en docs/roadmap.md y docs/requerimientos.md.

const REPO_URL = "https://github.com/SortMotion/MiGlobo/blob/main";
const doc = (ruta, texto = ruta) => `[${texto}](${REPO_URL}/${ruta})`;

export const fases = [
  { titulo: "Fase 0 · Arranque", descripcion: "Repo, Supabase, Meta y n8n listos para que todos puedan trabajar." },
  { titulo: "Fase 1 · Análisis", descripcion: "Objetivo 1: entender a los emprendedores y la viabilidad técnica." },
  { titulo: "Fase 2 · Diseño", descripcion: "Objetivo 2: arquitectura, flujos de IA e interfaz." },
  { titulo: "Fase 3 · Desarrollo", descripcion: "Objetivo 3: módulos de la plataforma integrados con WhatsApp." },
  { titulo: "Fase 4 · Evaluación", descripcion: "Objetivo 4: pruebas de campo con emprendedores reales." },
];

export const labels = [
  { nombre: "web", color: "1d76db", descripcion: "Next.js: panel y página pública" },
  { nombre: "n8n", color: "ff6d5a", descripcion: "Automatizaciones, WhatsApp e IA" },
  { nombre: "db", color: "3ecf8e", descripcion: "Supabase: migraciones, RLS, funciones" },
  { nombre: "docs", color: "c5def5", descripcion: "Documentación del proyecto" },
  { nombre: "evaluacion", color: "fbca04", descripcion: "Entrevistas, métricas y pruebas de campo" },
  { nombre: "tarea", color: "ededed", descripcion: "Algo que hay que construir" },
];

// Valores de los campos del Project.
export const prioridades = { M: "Mínimo demo", D: "Deseable", F: "Futuro" };
export const roles = { A: "A · Web", B: "B · Automatización", C: "C · Datos y evaluación", T: "Todos" };

const objetivos = [
  null,
  "1 · Analizar procesos y viabilidad técnica",
  "2 · Diseñar arquitectura, flujos de IA e interfaz",
  "3 · Desarrollar e integrar los módulos",
  "4 · Evaluar utilidad y usabilidad",
];

function cuerpo({ fase, rf, que, listo, refs = [] }) {
  const partes = [];
  if (objetivos[fase]) partes.push(`**Objetivo particular:** ${objetivos[fase]}`);
  if (rf) partes.push(`**Requerimiento:** ${rf} (${doc("docs/requerimientos.md", "requerimientos")})`);
  partes.push("", que, "", "## Listo cuando", ...listo.map((l) => `- [ ] ${l}`));
  if (refs.length) partes.push("", "## Referencias", ...refs.map((r) => `- ${r}`));
  return partes.join("\n");
}

const i = (datos) => ({ ...datos, body: cuerpo(datos) });

export const issues = [
  // ─── Fase 0 · Arranque ────────────────────────────────────────────
  i({
    titulo: "Configurar el repo: proteger main e invitar al equipo",
    fase: 0, area: ["docs"], rol: "C", prio: "M",
    que: "Dejar el repositorio listo para trabajar con Pull Requests.",
    listo: [
      "Andy y Diego tienen acceso de escritura al repo",
      "Regla de protección en `main`: requiere PR con 1 aprobación y que pase CI",
      "Opción *Squash merge* activada y *Automatically delete head branches* activado",
      "Todos leyeron CONTRIBUTING.md",
    ],
    refs: [doc("CONTRIBUTING.md")],
  }),
  i({
    titulo: "Crear proyecto en Supabase y correr las migraciones",
    fase: 0, area: ["db"], rol: "C", prio: "M",
    que: "Un solo proyecto de Supabase compartido por el equipo.",
    listo: [
      "Proyecto creado e integrantes invitados a la organización de Supabase",
      "Migraciones `esquema_inicial` y `funciones_n8n` aplicadas en orden",
      "*Confirm email* desactivado para desarrollo",
      "Llaves compartidas por un canal privado (no en el repo)",
    ],
    refs: [doc("docs/supabase.md")],
  }),
  i({
    titulo: "Cada integrante corre la web en su compu",
    fase: 0, area: ["web"], rol: "T", prio: "M",
    que: "Comprobar que todos pueden desarrollar con la misma base de datos.",
    listo: [
      "Andy: `npm run dev`, crea cuenta y negocio",
      "Diego: `npm run dev`, crea cuenta y negocio",
      "Adriel: `npm run dev`, crea cuenta y negocio",
      "Alguien corrió `supabase/seed.sql` y ve pedidos de ejemplo en el panel",
    ],
    refs: [doc("README.md")],
  }),
  i({
    titulo: "Crear app de Meta y número de prueba de WhatsApp",
    fase: 0, area: ["n8n"], rol: "B", prio: "M",
    que: "Obtener todo lo necesario para recibir y mandar mensajes con la WhatsApp Cloud API.",
    listo: [
      "App de Meta creada con el producto WhatsApp",
      "Números de los 3 integrantes verificados como destinatarios",
      "Se mandó un mensaje de prueba desde *API Setup*",
      "Phone number ID guardado en `negocios.whatsapp_phone_number_id` del negocio de prueba",
    ],
    refs: [doc("docs/whatsapp.md")],
  }),
  i({
    titulo: "Levantar n8n con túnel y recibir el primer webhook",
    fase: 0, area: ["n8n"], rol: "B", prio: "M",
    que: "n8n accesible por HTTPS para que Meta le mande los mensajes.",
    listo: [
      "n8n corriendo (Docker o `npx n8n`) con `WEBHOOK_URL` del túnel",
      "Flujo con *WhatsApp Trigger* activo",
      "Un mensaje enviado al número de prueba aparece en las ejecuciones de n8n",
      "Anotado en el issue el JSON real que entrega el trigger",
    ],
    refs: [doc("n8n/README.md")],
  }),

  // ─── Fase 1 · Análisis ────────────────────────────────────────────
  i({
    titulo: "Entrevistar a 3–5 emprendedores estudiantiles",
    fase: 1, area: ["evaluacion"], rol: "T", prio: "M",
    que: "Entender cómo venden hoy, desde el primer mensaje hasta la entrega.",
    listo: [
      "Al menos 3 entrevistas hechas con la guía",
      "Resumen de cada una en `docs/entrevistas/` sin datos personales",
      "Lista de problemas más repetidos",
      "Contacto de quienes aceptarían participar en la prueba de campo",
    ],
    refs: [doc("docs/requerimientos.md", "Guía de entrevista")],
  }),
  i({
    titulo: "Ajustar requerimientos y prioridades con las entrevistas",
    fase: 1, area: ["docs"], rol: "C", prio: "M",
    que: "Actualizar la lista de requerimientos con lo que dijeron los emprendedores.",
    listo: [
      "`docs/requerimientos.md` actualizado (agregar, quitar o cambiar prioridad)",
      "Issues del backlog ajustados a las nuevas prioridades",
    ],
    refs: [doc("docs/requerimientos.md")],
  }),
  i({
    titulo: "Documentar la viabilidad técnica de conectar las redes",
    fase: 1, area: ["n8n", "docs"], rol: "B", prio: "M",
    que: "Responder la pregunta abierta del análisis: qué se puede conectar, con qué permisos y qué límites.",
    listo: [
      "WhatsApp: número de prueba vs. número real de un emprendedor, ventana de 24 h, plantillas",
      "Instagram y Facebook: requisitos de cuenta y revisión de Meta",
      "Conclusión escrita en `docs/viabilidad.md`",
    ],
    refs: [doc("docs/whatsapp.md")],
  }),
  i({
    titulo: "Decidir y documentar cómo se manejan los pagos",
    fase: 1, area: ["docs"], rol: "C", prio: "M",
    que: "Pregunta abierta: ¿cobro dentro de la página o solo registro de anticipos? Propuesta actual: solo registro.",
    listo: [
      "Decisión tomada en equipo con su justificación",
      "Sección actualizada en `docs/arquitectura.md` y `docs/planteamiento.md`",
    ],
    refs: [doc("docs/arquitectura.md")],
  }),
  i({
    titulo: "Medir la línea base (semana sin MiGlobo)",
    fase: 1, area: ["evaluacion"], rol: "C", prio: "M",
    que: "Medir cómo les va hoy a los emprendedores para compararlo al final.",
    listo: [
      "Formulario diario creado (Google Forms)",
      "Participantes lo llenan durante 1 semana",
      "Resultados en la tabla *Antes* de `docs/evaluacion.md`",
    ],
    refs: [doc("docs/evaluacion.md")],
  }),

  // ─── Fase 2 · Diseño ──────────────────────────────────────────────
  i({
    titulo: "Bocetos de las pantallas principales en celular",
    fase: 2, area: ["web"], rol: "A", prio: "M",
    que: "Diseñar cómo se ven y se usan las pantallas antes de programarlas.",
    listo: [
      "Bocetos de: bandeja de mensajes, conversación, detalle de pedido, registrar anticipo, entregas del día",
      "Revisados con al menos 1 emprendedor",
      "Imágenes o liga de Figma en `docs/diseno.md`",
    ],
  }),
  i({
    titulo: "Armar y exportar el flujo whatsapp-entrante en n8n",
    fase: 2, area: ["n8n"], rol: "B", prio: "M",
    que: "Construir el flujo WhatsApp → guardar mensaje → IA → registrar pedido/clasificar.",
    listo: [
      "Flujo armado según la guía, nodo por nodo",
      "Un mensaje de pedido termina como pedido en el panel",
      "Un mensaje de pregunta queda clasificado como `pregunta`",
      "Exportado a `n8n/workflows/whatsapp-entrante.json` sin llaves",
    ],
    refs: [doc("n8n/README.md")],
  }),
  i({
    titulo: "Probar el prompt de la IA y medir su precisión inicial",
    fase: 2, area: ["n8n", "evaluacion"], rol: "B", prio: "M",
    que: "Saber hasta dónde la IA interpreta bien los mensajes (pregunta abierta del análisis).",
    listo: [
      "Los mensajes de prueba del prompt pasan por el flujo",
      "Agregar al menos 10 mensajes reales (de las entrevistas, anonimizados)",
      "% de aciertos de intención y de productos anotado en `n8n/prompt-extraccion.md`",
      "Prompt ajustado si falla en casos comunes",
    ],
    refs: [doc("n8n/prompt-extraccion.md")],
  }),
  i({
    titulo: "Revisar el modelo de datos con lo aprendido",
    fase: 2, area: ["db"], rol: "C", prio: "M",
    que: "Confirmar que las tablas cubren lo que salió en entrevistas y bocetos.",
    listo: [
      "Lista de cambios necesarios (si hay)",
      "Cambios hechos como migración nueva, no editando las existentes",
      "Diagrama de `docs/arquitectura.md` actualizado",
    ],
    refs: [doc("docs/arquitectura.md")],
  }),

  // ─── Fase 3 · Desarrollo (mínimo demo) ────────────────────────────
  i({
    titulo: "RF-03 Editar datos del negocio y conectar WhatsApp",
    fase: 3, area: ["web"], rol: "A", prio: "M", rf: "RF-03",
    que: "Pantalla de configuración del negocio, para no tener que usar SQL.",
    listo: [
      "Página `/panel/negocio` con nombre, descripción, slug y WhatsApp de contacto",
      "Campo para el *Phone number ID* de Meta",
      "Error claro si el slug ya existe",
    ],
  }),
  i({
    titulo: "Mostrar errores en los formularios del panel",
    fase: 3, area: ["web"], rol: "A", prio: "M",
    que: "Hoy, si una Server Action falla (p. ej. slug repetido), la página truena. Mostrar el error en el formulario.",
    listo: [
      "Formularios usan `useActionState` y muestran el mensaje",
      "Aplica a crear negocio, crear producto y los formularios nuevos",
    ],
  }),
  i({
    titulo: "RF-21 Mensajes agrupados por conversación",
    fase: 3, area: ["web"], rol: "A", prio: "M", rf: "RF-21",
    que: "La bandeja muestra un renglón por cliente; al abrirlo se ve la conversación completa.",
    listo: [
      "Lista de conversaciones con último mensaje y contador de no atendidos",
      "Vista de conversación con mensajes entrantes y salientes",
      "Se actualiza en tiempo real",
      "Usable en celular",
    ],
  }),
  i({
    titulo: "RF-30 Pedido creado por IA de punta a punta",
    fase: 3, area: ["n8n"], rol: "B", prio: "M", rf: "RF-30",
    que: "Demo principal: un cliente escribe por WhatsApp y el pedido aparece solo en el panel.",
    listo: [
      "Cliente escribe pedido → aparece en *Pedidos* con origen IA en menos de 10 s",
      "Si menciona lugar y hora, se crea la entrega",
      "El cliente recibe confirmación por WhatsApp y queda guardada como mensaje saliente",
      "Mensajes repetidos por Meta no duplican pedidos",
    ],
    refs: [doc("n8n/README.md")],
  }),
  i({
    titulo: "RF-33 Crear, editar y cancelar pedidos a mano",
    fase: 3, area: ["web"], rol: "A", prio: "M", rf: "RF-33",
    que: "El vendedor puede registrar pedidos que no llegaron por WhatsApp y corregir los de la IA.",
    listo: [
      "Formulario de nuevo pedido: cliente, productos del catálogo, cantidades, notas",
      "Detalle de pedido con sus productos, editable",
      "Botón para cancelar",
      "El total se recalcula",
    ],
  }),
  i({
    titulo: "RF-40 Registrar anticipos y pagos de un pedido",
    fase: 3, area: ["web", "db"], rol: "C", prio: "M", rf: "RF-40",
    que: "Desde el detalle del pedido, registrar cuánto pagó el cliente y cómo.",
    listo: [
      "Formulario: monto, tipo (anticipo/liquidación), método",
      "El pedido muestra pagado y saldo actualizados",
      "No se permite monto ≤ 0",
    ],
  }),
  i({
    titulo: "RF-42 Verificar pagos",
    fase: 3, area: ["web"], rol: "C", prio: "M", rf: "RF-42",
    que: "El vendedor marca un pago como verificado cuando confirma la transferencia. Solo los verificados cuentan en *pagado*.",
    listo: [
      "Botón *Verificar* en la lista de anticipos",
      "Filtro de pagos pendientes de verificar",
    ],
  }),
  i({
    titulo: "RF-50 Programar la entrega de un pedido",
    fase: 3, area: ["web"], rol: "C", prio: "M", rf: "RF-50",
    que: "Desde el detalle del pedido, definir lugar y hora de entrega (o corregir la que puso la IA).",
    listo: [
      "Formulario con lugar y fecha/hora",
      "Lugares usados antes se sugieren para no reescribirlos",
      "Reprogramar cancela la entrega anterior",
    ],
  }),
  i({
    titulo: "RF-52 Marcar entregas como realizadas",
    fase: 3, area: ["web"], rol: "C", prio: "M", rf: "RF-52",
    que: "Cerrar el ciclo del pedido desde la lista de entregas.",
    listo: [
      "Botón *Entregado* en cada entrega",
      "Al marcarla, el pedido pasa a `entregado`",
      "Vista de entregas agrupada por día (hoy, mañana, después)",
    ],
  }),
  i({
    titulo: "Revisión del panel en celular (RNF-01)",
    fase: 3, area: ["web"], rol: "A", prio: "M",
    que: "La mayoría de vendedores usará MiGlobo desde el celular.",
    listo: [
      "Todas las pantallas probadas a 375 px de ancho",
      "Tablas se convierten en tarjetas en pantallas chicas",
      "Menú usable con una mano",
    ],
  }),
  i({
    titulo: "Desplegar la web en Vercel",
    fase: 3, area: ["web"], rol: "A", prio: "M",
    que: "Tener una URL pública para las pruebas de campo.",
    listo: [
      "Proyecto en Vercel con *Root Directory* = `web`",
      "Variables de entorno configuradas",
      "*Site URL* de Supabase apuntando a la URL de producción",
      "Previews automáticos en cada PR",
    ],
  }),
  i({
    titulo: "Desplegar n8n en un servidor fijo con token permanente",
    fase: 3, area: ["n8n"], rol: "B", prio: "M",
    que: "El túnel temporal no sirve para las pruebas de campo: n8n debe estar siempre encendido.",
    listo: [
      "n8n en un servidor con URL HTTPS fija",
      "Token permanente de *System User* de Meta",
      "Flujo importado desde `n8n/workflows/` y activo",
      "Pasos documentados en `n8n/README.md`",
    ],
    refs: [doc("docs/whatsapp.md", "Token permanente")],
  }),

  // ─── Fase 3 · Desarrollo (deseables y futuro) ─────────────────────
  i({
    titulo: "RF-11 Editar, ocultar y poner foto a productos",
    fase: 3, area: ["web", "db"], rol: "A", prio: "D", rf: "RF-11",
    que: "Administrar el catálogo completo desde el panel.",
    listo: [
      "Editar nombre, descripción y precio",
      "Activar / desactivar (los inactivos no salen en la página pública)",
      "Subir foto a Supabase Storage y mostrarla en la página pública",
    ],
  }),
  i({
    titulo: "RF-22 Responder mensajes desde el panel",
    fase: 3, area: ["web", "n8n"], rol: "B", prio: "D", rf: "RF-22",
    que: "Escribir la respuesta en MiGlobo y que llegue por WhatsApp.",
    listo: [
      "Caja de texto en la conversación",
      "El envío pasa por n8n (webhook) o por la API de WhatsApp desde un Route Handler",
      "El mensaje queda guardado como saliente",
      "Aviso si pasaron más de 24 h desde el último mensaje del cliente",
    ],
  }),
  i({
    titulo: "RF-23 Respuestas automáticas a preguntas frecuentes",
    fase: 3, area: ["n8n"], rol: "B", prio: "D", rf: "RF-23",
    que: "Cuando la intención es `pregunta`, un agente de IA responde con base en el catálogo.",
    listo: [
      "Responde precio y disponibilidad usando el catálogo",
      "Si no sabe, no inventa: deja el mensaje para el vendedor",
      "El vendedor puede apagar las respuestas automáticas",
    ],
  }),
  i({
    titulo: "RF-34 Ver el mensaje de origen de un pedido de la IA",
    fase: 3, area: ["web"], rol: "A", prio: "D", rf: "RF-34",
    que: "Para revisar rápido si la IA entendió bien.",
    listo: [
      "En el detalle del pedido se ve el mensaje original",
      "Liga a la conversación",
    ],
  }),
  i({
    titulo: "RF-41 Subir comprobante de pago",
    fase: 3, area: ["web", "db"], rol: "C", prio: "D", rf: "RF-41",
    que: "Guardar la foto del comprobante junto al pago.",
    listo: [
      "Bucket privado en Supabase Storage con políticas por negocio",
      "Subir imagen al registrar o verificar un pago",
      "Ver el comprobante desde la lista de anticipos",
    ],
  }),
  i({
    titulo: "RF-53 Recordatorio de entrega por WhatsApp",
    fase: 3, area: ["n8n"], rol: "B", prio: "D", rf: "RF-53",
    que: "Cada mañana, avisar a los clientes que tienen entrega ese día.",
    listo: [
      "Flujo con *Schedule Trigger* diario",
      "Plantilla de mensaje aprobada por Meta (fuera de la ventana de 24 h)",
      "El recordatorio queda guardado como mensaje saliente",
    ],
  }),
  i({
    titulo: "Generar los tipos de TypeScript desde Supabase",
    fase: 3, area: ["web", "db"], rol: "C", prio: "D",
    que: "Reemplazar `web/src/lib/types.ts` escrito a mano por tipos generados.",
    listo: [
      "`npx supabase gen types` genera `database.types.ts`",
      "Los clientes de Supabase usan el tipo `Database`",
      "Script `npm run tipos` documentado",
    ],
  }),
  i({
    titulo: "RF-24 Conectar Instagram y Facebook",
    fase: 3, area: ["n8n", "db"], rol: "B", prio: "F", rf: "RF-24",
    que: "Segunda y tercera red social, con el mismo patrón que WhatsApp.",
    listo: [
      "Función `registrar_mensaje_meta` análoga a la de WhatsApp",
      "Flujo de n8n para mensajes de Instagram/Messenger",
      "Mensajes de las 3 redes en la misma bandeja",
    ],
    refs: [doc("docs/whatsapp.md", "Límites de Meta")],
  }),

  // ─── Fase 4 · Evaluación ──────────────────────────────────────────
  i({
    titulo: "Dar de alta a los emprendedores de prueba",
    fase: 4, area: ["evaluacion"], rol: "T", prio: "M",
    que: "Preparar a los participantes de la prueba de campo.",
    listo: [
      "Consentimiento firmado por cada participante",
      "Cada uno con cuenta, negocio y productos cargados",
      "WhatsApp conectado según lo decidido en la viabilidad",
      "Acompañamiento el primer día",
    ],
    refs: [doc("docs/evaluacion.md")],
  }),
  i({
    titulo: "Periodo de uso real (1–2 semanas)",
    fase: 4, area: ["evaluacion"], rol: "T", prio: "M",
    que: "Los participantes venden usando MiGlobo y llenan el formulario diario.",
    listo: [
      "Formulario diario llenado todos los días",
      "Registro de errores o quejas como issues con label `bug`",
      "Revisión a mitad del periodo",
    ],
  }),
  i({
    titulo: "Medición final, cuestionario SUS y precisión de la IA",
    fase: 4, area: ["evaluacion"], rol: "C", prio: "M",
    que: "Llenar la tabla *Después* y comparar.",
    listo: [
      "Métricas *Después* en `docs/evaluacion.md`",
      "SUS aplicado y calculado",
      "Precisión de la IA con los mensajes reales",
    ],
    refs: [doc("docs/evaluacion.md")],
  }),
  i({
    titulo: "Reporte de resultados",
    fase: 4, area: ["docs"], rol: "T", prio: "M",
    que: "Documento final que demuestra si se cumplió el objetivo general.",
    listo: [
      "Comparación antes/después con gráficas",
      "Cumplimiento de cada objetivo particular",
      "Limitaciones y trabajo futuro",
    ],
  }),
  i({
    titulo: "Preparar la demo final",
    fase: 4, area: ["docs"], rol: "T", prio: "M",
    que: "Presentación en vivo del flujo completo.",
    listo: [
      "Guion: mensaje por WhatsApp → pedido en el panel → anticipo → entrega",
      "Datos de demo limpios",
      "Plan B grabado en video por si falla internet",
    ],
  }),
];
