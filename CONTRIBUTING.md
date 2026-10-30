# Cómo trabajamos

## Flujo de Git

`main` siempre funciona. Nadie hace push directo a `main`: todo entra por Pull Request.

```bash
git switch main
git pull
git switch -c feat/pedido-manual
```

```bash
git add .
git commit -m "feat(pedidos): formulario para crear pedido a mano"
git push -u origin feat/pedido-manual
```

Luego abren el PR en GitHub, piden revisión a otra persona del equipo y, cuando la aprueba,
hacen **Squash and merge** y borran la rama.

### Nombres de rama

| Prefijo | Para |
|---|---|
| `feat/` | Algo nuevo (`feat/anticipos-registrar`) |
| `fix/` | Arreglar un error (`fix/login-redirect`) |
| `docs/` | Solo documentación |
| `db/` | Migraciones nuevas |
| `n8n/` | Cambios en flujos exportados |

### Mensajes de commit

`tipo(área): qué hace`, en español y en presente:

- `feat(mensajes): agrupar por conversación`
- `fix(panel): mostrar error si el slug ya existe`
- `db: agregar comprobante_url a pagos`

## Issues y tablero

- Cada tarea del [roadmap](docs/roadmap.md) es un Issue. En el título va el ID del requerimiento: `RF-33 Crear pedido a mano`.
- Tablero en **GitHub Projects** con columnas *Por hacer · En progreso · En revisión · Hecho*.
- En el PR escriban `Closes #12` para que el Issue se cierre solo al hacer merge.

## Reglas del código

- **Nunca** subir `.env`, `.env.local` ni llaves. Si se sube una por error, se **rota** en Supabase/Meta (borrar el commit no basta).
- **Next.js 16 con Cache Components:** todo componente que lea la sesión, `params`,
  `searchParams` o la base de datos va dentro de `<Suspense>`. Copien el patrón de
  `web/src/app/panel/pedidos/page.tsx`. Si `npm run build` falla con
  *"Uncached data was accessed outside of `<Suspense>`"*, es eso.
- Las escrituras van en Server Actions (`web/src/app/panel/actions.ts`); verifican el negocio con `requireNegocio()`.
- Migraciones: archivo nuevo, nunca editar uno ya aplicado ([`docs/supabase.md`](docs/supabase.md)).
- Antes de abrir PR: `npm run lint` y `npm run build` dentro de `web/`. GitHub Actions lo vuelve a correr.
