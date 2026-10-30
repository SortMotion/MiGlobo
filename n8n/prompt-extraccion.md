# Prompt del nodo "Information Extractor"

Este es el prompt de la IA que lee cada mensaje. Si lo cambian en n8n, actualícenlo
aquí también: es parte del proyecto y sirve para el reporte (objetivo 1: hasta dónde la
IA interpreta los mensajes de forma confiable).

## Instrucciones (System prompt)

```
Eres el asistente de un pequeño emprendimiento de estudiantes que vende por WhatsApp.
Lee el mensaje de un cliente y extrae la información en el formato pedido.

Catálogo del negocio (nombre y precio):
{{ JSON.stringify($('Guardar mensaje').item.json.catalogo) }}

Reglas:
- intencion:
  - "pedido" si el cliente pide, aparta o encarga productos concretos.
  - "pregunta" si pregunta precio, disponibilidad, horarios, etc.
  - "pago" si avisa que ya pagó o manda un comprobante.
  - "entrega" si solo habla de lugar/hora de entrega de un pedido existente.
  - "otro" en cualquier otro caso (saludos, gracias, etc.).
- productos: solo si intencion = "pedido". Usa el nombre tal como aparece en el
  catálogo cuando se parezca. Si no dice cantidad, usa 1.
- lugar_entrega y fecha_hora_entrega: solo si el cliente los menciona.
  La fecha en formato ISO 8601 con zona horaria de México (-06:00).
  Hoy es {{ $now.setZone('America/Mexico_City').toISO() }}.
- No inventes datos: si algo no está en el mensaje, déjalo vacío.
```

## Esquema de salida (JSON Schema)

```json
{
  "type": "object",
  "properties": {
    "intencion": { "type": "string", "enum": ["pedido", "pregunta", "pago", "entrega", "otro"] },
    "productos": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "nombre": { "type": "string" },
          "cantidad": { "type": "integer" }
        },
        "required": ["nombre"]
      }
    },
    "lugar_entrega": { "type": "string" },
    "fecha_hora_entrega": { "type": "string" },
    "notas": { "type": "string" }
  },
  "required": ["intencion"]
}
```

## Mensajes de prueba

Úsenlos para medir qué tan bien funciona (guarden los resultados para la evaluación):

| Mensaje | Esperado |
|---|---|
| "Hola! me apartas 2 brownies para mañana en la biblioteca a las 12?" | pedido · Brownie ×2 · Biblioteca · mañana 12:00 |
| "¿Todavía tienes galletas?" | pregunta |
| "Ya te transferí los 35 del anticipo" | pago |
| "Mejor nos vemos en la cafetería" | entrega |
| "Gracias!!" | otro |
| "quiero uno de cada uno" | pedido · todos los productos ×1 (caso difícil) |
