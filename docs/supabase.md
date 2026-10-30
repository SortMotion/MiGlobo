# Configurar Supabase

Lo hace **una sola persona**. Después invita al resto del equipo.

## 1. Crear el proyecto

1. Entra a https://supabase.com/dashboard y crea un proyecto (región: la más cercana, p. ej. `us-east`).
2. **Organization → Team → Invite**: agrega a los demás integrantes.

## 2. Crear las tablas

**Opción fácil: SQL Editor.** Abre cada archivo de `supabase/migrations/` **en orden**,
pégalo en *SQL Editor* y ejecútalo:

1. `20261030000000_esquema_inicial.sql`
2. `20261030000100_funciones_n8n.sql`

**Opción CLI** (útil cuando haya más migraciones):

```bash
npx supabase init
```

```bash
npx supabase link --project-ref TU_PROJECT_REF
```

```bash
npx supabase db push
```

> **Regla de oro:** una migración que ya se corrió **no se edita**. Si hay que cambiar algo,
> se crea un archivo nuevo con fecha más reciente, p. ej. `20261105120000_pagos_comprobante.sql`.

## 3. Llaves

*Project Settings → API Keys*:

| Llave | Dónde va |
|---|---|
| Project URL | `web/.env.local` → `NEXT_PUBLIC_SUPABASE_URL` y en n8n |
| Publishable key (`sb_publishable_…`) | `web/.env.local` → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| Secret key (`sb_secret_…`) | **Solo** en la credencial de n8n. Nunca en git ni en `web/` |

Compártanlas por un canal privado, no en el repo ni en issues.

## 4. Login

*Authentication → Sign In / Providers → Email*:

- Para desarrollo, desactiven **Confirm email** para poder crear cuentas sin revisar el correo.
- Para las pruebas con usuarios reales, actívenlo de nuevo y pongan la URL de producción en
  *Authentication → URL Configuration → Site URL*.

## 5. Datos de prueba

Crea tu cuenta y tu negocio desde la web, luego corre `supabase/seed.sql` en el SQL Editor.

## 6. Conectar tu WhatsApp de prueba a tu negocio

Mientras no exista la pantalla para hacerlo (RF-03):

```sql
update negocios
set whatsapp_phone_number_id = 'EL_PHONE_NUMBER_ID_DE_META'
where slug = 'tu-slug';
```
