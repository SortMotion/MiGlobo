import { Suspense } from "react";
import { formatoDinero, formatoFecha } from "@/lib/formato";
import { requireNegocio } from "@/lib/negocio";
import { createClient } from "@/lib/supabase/server";

type Pago = {
  id: string;
  monto: number;
  tipo: string;
  metodo: string;
  verificado: boolean;
  created_at: string;
  pedidos: { clientes: { nombre: string | null } | null };
};

export default function AnticiposPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Anticipos y pagos</h1>
      <Suspense fallback={<p className="text-zinc-500">Cargando…</p>}>
        <TablaPagos />
      </Suspense>
    </>
  );
}

async function TablaPagos() {
  const negocio = await requireNegocio();
  const supabase = await createClient();
  const { data } = await supabase
    .from("pagos")
    .select("id, monto, tipo, metodo, verificado, created_at, pedidos!inner(negocio_id, clientes(nombre))")
    .eq("pedidos.negocio_id", negocio.id)
    .order("created_at", { ascending: false })
    .returns<Pago[]>();

  // TODO (módulo Anticipos): registrar pago, subir comprobante a Supabase Storage y verificarlo.
  return (
    <>
      <div className="overflow-x-auto">
        <table className="tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Método</th>
              <th>Monto</th>
              <th>Verificado</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((p) => (
              <tr key={p.id}>
                <td>{formatoFecha(p.created_at)}</td>
                <td>{p.pedidos.clientes?.nombre ?? "—"}</td>
                <td>{p.tipo}</td>
                <td>{p.metodo}</td>
                <td>{formatoDinero(p.monto)}</td>
                <td>{p.verificado ? "Sí" : "Pendiente"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!data?.length && <p className="text-zinc-500">Todavía no hay pagos registrados.</p>}
    </>
  );
}
