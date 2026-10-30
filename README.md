# MiGlobo

Página web para estudiantes que venden por redes sociales: **mensajes, pedidos,
anticipos y entregas en un solo lugar**, con automatizaciones de IA en n8n que leen
los chats de WhatsApp y registran los pedidos solos.

Proyecto final · Equipo: Andy, Diego y Adriel.
El planteamiento y los objetivos están en [`docs/planteamiento.md`](docs/planteamiento.md).

## Cómo está armado

| Carpeta | Qué hay | Tecnología |
|---|---|---|
| [`web/`](web) | Panel del vendedor y página pública de cada tienda (`/t/<slug>`) | Next.js 16 + Tailwind |
| [`supabase/`](supabase) | Esquema de la base de datos, seguridad (RLS) y funciones para n8n | Postgres en Supabase |
| [`n8n/`](n8n) | Guía del flujo WhatsApp → IA → Supabase, prompt y flujos exportados | n8n |
| [`docs/`](docs) | Arquitectura, requerimientos, roadmap, guías de configuración | Markdown |

Arquitectura completa: [`docs/arquitectura.md`](docs/arquitectura.md).

## Arrancar en tu compu

Requisitos: Node 22 o más nuevo, Git y una cuenta en [Supabase](https://supabase.com) (gratis).

1. **Base de datos.** Un solo integrante crea el proyecto en Supabase y corre las
   migraciones. Los demás usan las mismas llaves. Pasos: [`docs/supabase.md`](docs/supabase.md).
2. **Web:**

   ```bash
   cd web
   npm install
   cp .env.example .env.local   # y llena las llaves de Supabase
   npm run dev
   ```

   Abre http://localhost:3000, crea una cuenta y luego tu negocio.
3. **Datos de prueba (opcional):** corre [`supabase/seed.sql`](supabase/seed.sql) en el SQL Editor.
4. **WhatsApp + n8n:** [`docs/whatsapp.md`](docs/whatsapp.md) y [`n8n/README.md`](n8n/README.md).

## Cómo trabajamos

Ramas, commits y Pull Requests: [`CONTRIBUTING.md`](CONTRIBUTING.md).
Qué sigue y quién hace qué: [`docs/roadmap.md`](docs/roadmap.md).
