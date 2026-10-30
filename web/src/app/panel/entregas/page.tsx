import { Suspense } from "react";
import { formatoFecha } from "@/lib/formato";
import { requireNegocio } from "@/lib/negocio";
import { createClient } from "@/lib/supabase/server";

type Entrega = {
  id: string;
  lugar: string;
  fecha_hora: string;
  estado: string;
  notas: string | null;
  pedidos: { clientes: { nombre: string | null } | null };
};

export default function EntregasPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Entregas</h1>
      <Suspense fallback={<p className="text-zinc-500">Cargando…</p>}>
        <ListaEntregas />
      </Suspense>
    </>
  );
}

async function ListaEntregas() {
  const negocio = await requireNegocio();
  const supabase = await createClient();
  const { data } = await supabase
    .from("entregas")
    .select("id, lugar, fecha_hora, estado, notas, pedidos!inner(negocio_id, clientes(nombre))")
    .eq("pedidos.negocio_id", negocio.id)
    .eq("estado", "programada")
    .order("fecha_hora")
    .returns<Entrega[]>();

  // TODO (módulo Entregas): programar entrega desde un pedido, marcar realizada y vista por día.
  return (
    <>
      <ul className="flex flex-col gap-2">
        {data?.map((e) => (
          <li key={e.id} className="tarjeta">
            <p className="font-medium">{formatoFecha(e.fecha_hora)} · {e.lugar}</p>
            <p className="text-sm text-zinc-500">
              {e.pedidos.clientes?.nombre ?? "Sin nombre"}
              {e.notas && ` · ${e.notas}`}
            </p>
          </li>
        ))}
      </ul>
      {!data?.length && <p className="text-zinc-500">No hay entregas programadas.</p>}
    </>
  );
}
