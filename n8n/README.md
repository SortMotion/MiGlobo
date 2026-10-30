# n8n · Automatizaciones de MiGlobo

n8n es el "pegamento" entre WhatsApp, la IA y Supabase. La lógica de base de datos
**no** vive en n8n sino en funciones de Postgres
([`supabase/migrations/20261030000100_funciones_n8n.sql`](../supabase/migrations/20261030000100_funciones_n8n.sql)),
así el flujo queda corto y la lógica queda versionada en git.

```
WhatsApp ──webhook──▶ n8n ──rpc──▶ Supabase ◀──── Panel web (Next.js)
                       │                              ▲
                       └──▶ IA (extrae pedido) ───────┘ (tiempo real)
```

## 1. Levantar n8n

n8n necesita una **URL pública HTTPS** para que Meta le mande los webhooks.

**Opción A: Docker (recomendada si alguien del equipo tiene Docker Desktop)**

```bash
docker compose up -d n8n
```

Abre http://localhost:5678 y crea la cuenta de dueño.

**Opción B: sin Docker.** Requiere Node 22 LTS (n8n no siempre soporta la versión más nueva de Node).

```bash
npx n8n
```

**URL pública para el webhook.** Con n8n corriendo, en otra terminal:

```bash
npx cloudflared tunnel --url http://localhost:5678
```

Copia la URL `https://xxxx.trycloudflare.com`, ponla como `WEBHOOK_URL` en `.env`
y reinicia n8n. Esa URL cambia cada vez que reinicias el túnel; para la demo final
conviene desplegar n8n en un servidor fijo (Render, Railway, Oracle Free Tier, etc.).

## 2. Credenciales en n8n

| Credencial | Dónde se saca | Para qué |
|---|---|---|
| **WhatsApp OAuth API** (App ID + App Secret) | Meta for Developers → tu app → Configuración → Básica | El nodo *WhatsApp Trigger* |
| **WhatsApp API** (Access Token + Business Account ID) | Meta → WhatsApp → Configuración de la API | Mandar mensajes |
| **Header Auth "Supabase secret"**: header `apikey`, valor `sb_secret_...` | Supabase → Project Settings → API Keys | Llamar las funciones RPC |
| **Modelo de IA** (Gemini, OpenAI o Anthropic) | La consola del proveedor que elijan | Entender los mensajes |

> La secret key de Supabase se salta toda la seguridad (RLS). Solo va en n8n, nunca en
> el código de `web/` ni en git.

Guía para obtener lo de Meta: [`docs/whatsapp.md`](../docs/whatsapp.md).

## 3. Flujo `whatsapp-entrante`

Construyan este flujo nodo por nodo. Cuando funcione, expórtenlo a `n8n/workflows/`
(ver abajo).

| # | Nodo | Configuración |
|---|---|---|
| 1 | **WhatsApp Trigger** | Updates: `messages` |
| 2 | **If** "¿es mensaje de texto?" | `{{ $json.messages?.[0]?.type }}` es igual a `text`. Así se ignoran los avisos de "entregado/leído" |
| 3 | **HTTP Request** "Guardar mensaje" | `POST {{SUPABASE_URL}}/rest/v1/rpc/registrar_mensaje_whatsapp`, credencial *Supabase secret*, body JSON ↓ |
| 4 | **If** "¿nuevo?" | `{{ $json.ok }}` es `true` (descarta duplicados y números sin negocio) |
| 5 | **Information Extractor** (IA) | Texto: el mensaje original. Prompt y esquema en [`prompt-extraccion.md`](prompt-extraccion.md) |
| 6 | **Switch** por `{{ $json.output.intencion }}` | Salidas: `pedido` / otra |
| 7a | **HTTP Request** "Registrar pedido" | `POST .../rpc/registrar_pedido_ia` ↓ |
| 8a | **WhatsApp** → Send Message | Confirmación al cliente (ver texto abajo) |
| 9a | **HTTP Request** "Guardar respuesta" | `POST .../rpc/registrar_respuesta` |
| 7b | **HTTP Request** "Clasificar" | `POST .../rpc/clasificar_mensaje` |

Body del paso 3:

```json
{
  "p_phone_number_id": "{{ $('WhatsApp Trigger').item.json.metadata.phone_number_id }}",
  "p_wa_id": "{{ $('WhatsApp Trigger').item.json.contacts[0].wa_id }}",
  "p_nombre": "{{ $('WhatsApp Trigger').item.json.contacts[0].profile.name }}",
  "p_texto": "{{ $('WhatsApp Trigger').item.json.messages[0].text.body }}",
  "p_mensaje_id": "{{ $('WhatsApp Trigger').item.json.messages[0].id }}"
}
```

> Revisen la salida real del *WhatsApp Trigger* con un mensaje de prueba ("Test step");
> si la forma del JSON cambia entre versiones de n8n, ajusten estas rutas.

Body del paso 7a:

```json
{
  "p_mensaje_id": "{{ $('Guardar mensaje').item.json.mensaje_id }}",
  "p_items": {{ JSON.stringify($json.output.productos) }},
  "p_notas": "{{ $json.output.notas ?? '' }}",
  "p_lugar": {{ $json.output.lugar_entrega ? JSON.stringify($json.output.lugar_entrega) : null }},
  "p_fecha_hora": {{ $json.output.fecha_hora_entrega ? JSON.stringify($json.output.fecha_hora_entrega) : null }}
}
```

Texto sugerido para 8a: *"¡Gracias! Registré tu pedido 🧾 En un momento te confirmo
el total y el punto de entrega."*

Body del paso 7b:

```json
{
  "p_mensaje_id": "{{ $('Guardar mensaje').item.json.mensaje_id }}",
  "p_intencion": "{{ $json.output.intencion }}"
}
```

## 4. Guardar los flujos en el repo

n8n guarda los flujos en su propia base de datos, no en archivos. Para versionarlos:

1. En n8n: menú del flujo → **Download** → guárdenlo en `n8n/workflows/whatsapp-entrante.json`.
2. Antes de hacer commit, revisen el JSON. No debe traer tokens (n8n exporta solo el
   *nombre* de la credencial, pero revisen campos escritos a mano como headers).
3. Para importarlo en otra compu: **Import from File** y reasignar credenciales.

## Ideas para después

- Responder preguntas automáticamente con un nodo **AI Agent** que reciba el `catalogo`
  que regresa `registrar_mensaje_whatsapp`.
- Flujo `recordatorio-entregas`: *Schedule Trigger* cada mañana, manda WhatsApp a los
  clientes con entrega ese día.
- Instagram/Facebook: mismo patrón, con una función `registrar_mensaje_meta` análoga.
