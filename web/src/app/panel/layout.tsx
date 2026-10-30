import Link from "next/link";
import { Suspense } from "react";
import { cerrarSesion } from "@/app/login/actions";
import { getMiNegocio } from "@/lib/negocio";
import { crearNegocio } from "./actions";

const secciones = [
  { href: "/panel", label: "Resumen" },
  { href: "/panel/mensajes", label: "Mensajes" },
  { href: "/panel/pedidos", label: "Pedidos" },
  { href: "/panel/anticipos", label: "Anticipos" },
  { href: "/panel/entregas", label: "Entregas" },
  { href: "/panel/productos", label: "Productos" },
] as const;

export default function PanelLayout({ children }: LayoutProps<"/panel">) {
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-black/10 p-3 md:w-52 md:flex-col md:border-r md:border-b-0 dark:border-white/15">
        <span className="px-3 py-2 font-semibold">MiGlobo</span>
        {secciones.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-lg px-3 py-2 text-sm whitespace-nowrap hover:bg-black/5 dark:hover:bg-white/10"
          >
            {s.label}
          </Link>
        ))}
        <form action={cerrarSesion} className="md:mt-auto">
          <button className="rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-black/5 dark:hover:bg-white/10">
            Salir
          </button>
        </form>
      </nav>

      <main className="flex flex-1 flex-col gap-6 p-6">
        <Suspense fallback={<p className="text-zinc-500">Cargando…</p>}>
          <ConNegocio>{children}</ConNegocio>
        </Suspense>
      </main>
    </div>
  );
}

// Si el usuario todavía no tiene negocio, primero le pedimos que lo cree.
async function ConNegocio({ children }: { children: React.ReactNode }) {
  const negocio = await getMiNegocio();
  if (negocio) return children;

  return (
    <section className="flex max-w-md flex-col gap-4">
      <h1 className="text-2xl font-semibold">Crea tu negocio</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Con esto armamos tu página pública y conectamos tu WhatsApp.
      </p>
      <form action={crearNegocio} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Nombre
          <input name="nombre" required className="input" placeholder="Postres de Andy" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Dirección de tu página (miglobo.app/t/…)
          <input
            name="slug"
            required
            pattern="[a-z0-9\-]{3,40}"
            className="input"
            placeholder="postres-andy"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          WhatsApp para contacto (con lada, solo números)
          <input name="whatsapp_numero" inputMode="numeric" className="input" placeholder="5213312345678" />
        </label>
        <button className="btn-primario">Crear</button>
      </form>
    </section>
  );
}
