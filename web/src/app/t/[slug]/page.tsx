import { notFound } from "next/navigation";
import { Suspense } from "react";
import { formatoDinero } from "@/lib/formato";
import { createClient } from "@/lib/supabase/server";
import type { Negocio, Producto } from "@/lib/types";

// Página pública de cada emprendimiento: /t/<slug>
// Es el "espacio público de contacto para compradores" del objetivo 3.
export default function TiendaPage({ params }: PageProps<"/t/[slug]">) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <Suspense fallback={<p className="text-zinc-500">Cargando…</p>}>
        <Tienda params={params} />
      </Suspense>
    </main>
  );
}

async function Tienda({ params }: { params: PageProps<"/t/[slug]">["params"] }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: negocio } = await supabase
    .from("negocios")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<Negocio>();
  if (!negocio) notFound();

  const { data: productos } = await supabase
    .from("productos")
    .select("*")
    .eq("negocio_id", negocio.id)
    .eq("activo", true)
    .order("created_at")
    .returns<Producto[]>();

  const linkWhatsapp = (texto: string) =>
    negocio.whatsapp_numero
      ? `https://wa.me/${negocio.whatsapp_numero}?text=${encodeURIComponent(texto)}`
      : null;

  const contacto = linkWhatsapp(`Hola ${negocio.nombre}, vi tu página en MiGlobo`);

  return (
    <>
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold">{negocio.nombre}</h1>
        {negocio.descripcion && <p className="text-zinc-600 dark:text-zinc-400">{negocio.descripcion}</p>}
        {contacto && (
          <a href={contacto} className="btn-primario self-start" target="_blank" rel="noopener noreferrer">
            Escríbenos por WhatsApp
          </a>
        )}
      </header>

      <ul className="flex flex-col gap-3">
        {productos?.map((p) => {
          const pedir = linkWhatsapp(`Hola, quiero pedir: ${p.nombre}`);
          return (
            <li key={p.id} className="tarjeta flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{p.nombre}</p>
                {p.descripcion && <p className="text-sm text-zinc-500">{p.descripcion}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{formatoDinero(p.precio)}</span>
                {pedir && (
                  <a href={pedir} className="btn-secundario text-sm" target="_blank" rel="noopener noreferrer">
                    Pedir
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
