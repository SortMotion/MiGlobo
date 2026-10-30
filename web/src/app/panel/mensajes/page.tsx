import { Suspense } from "react";
import { EscucharCambios } from "@/components/escuchar-cambios";
import { formatoFecha } from "@/lib/formato";
import { requireNegocio } from "@/lib/negocio";
import { createClient } from "@/lib/supabase/server";
import type { Mensaje } from "@/lib/types";
import { marcarAtendido } from "../actions";

export default function MensajesPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Mensajes</h1>
      <Suspense fallback={<p className="text-zinc-500">Cargando…</p>}>
        <ListaMensajes />
      </Suspense>
    </>
  );
}

async function ListaMensajes() {
  const negocio = await requireNegocio();
  const supabase = await createClient();
  const { data } = await supabase
    .from("mensajes")
    .select("id, canal, direccion, texto, intencion, atendido, created_at, clientes(nombre)")
    .eq("negocio_id", negocio.id)
    .order("created_at", { ascending: false })
    .limit(50)
    .returns<Mensaje[]>();

  // TODO (módulo Mensajes): agrupar por cliente como conversación y responder desde aquí.
  return (
    <>
      <EscucharCambios tabla="mensajes" negocioId={negocio.id} />
      {!data?.length && (
        <p className="text-zinc-500">
          Aún no hay mensajes. Cuando conectes WhatsApp con n8n aparecerán aquí.
        </p>
      )}
      <ul className="flex flex-col gap-2">
        {data?.map((m) => (
          <li key={m.id} className={`tarjeta flex items-start gap-4 ${m.atendido ? "opacity-60" : ""}`}>
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-sm text-zinc-500">
                {m.clientes?.nombre ?? "Sin nombre"} · {m.canal} · {formatoFecha(m.created_at)}
                {m.intencion && <span className="ml-2 rounded bg-black/5 px-1.5 dark:bg-white/10">{m.intencion}</span>}
              </p>
              <p>{m.direccion === "saliente" && "↪ "}{m.texto}</p>
            </div>
            {!m.atendido && m.direccion === "entrante" && (
              <form action={marcarAtendido.bind(null, m.id)}>
                <button className="btn-secundario text-sm">Atendido</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
