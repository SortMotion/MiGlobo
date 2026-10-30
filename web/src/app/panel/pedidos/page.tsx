import { Suspense } from "react";
import { EscucharCambios } from "@/components/escuchar-cambios";
import { formatoDinero, formatoFecha } from "@/lib/formato";
import { requireNegocio } from "@/lib/negocio";
import { createClient } from "@/lib/supabase/server";
import type { PedidoEstado, PedidoResumen } from "@/lib/types";
import { cambiarEstadoPedido } from "../actions";

const siguienteEstado: Partial<Record<PedidoEstado, PedidoEstado>> = {
  pendiente: "confirmado",
  confirmado: "listo",
  listo: "entregado",
};

export default function PedidosPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Pedidos</h1>
      <Suspense fallback={<p className="text-zinc-500">Cargando…</p>}>
        <TablaPedidos />
      </Suspense>
    </>
  );
}

async function TablaPedidos() {
  const negocio = await requireNegocio();
  const supabase = await createClient();
  const { data } = await supabase
    .from("pedidos_resumen")
    .select("id, estado, origen, total, pagado, saldo, notas, cliente_nombre, created_at")
    .eq("negocio_id", negocio.id)
    .order("created_at", { ascending: false })
    .returns<PedidoResumen[]>();

  // TODO (módulo Pedidos): crear pedido manual, ver detalle con sus productos y cancelar.
  return (
    <>
      <EscucharCambios tabla="pedidos" negocioId={negocio.id} />
      <div className="overflow-x-auto">
        <table className="tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Total</th>
              <th>Pagado</th>
              <th>Falta</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {data?.map((p) => {
              const siguiente = siguienteEstado[p.estado];
              return (
                <tr key={p.id}>
                  <td>{formatoFecha(p.created_at)}</td>
                  <td>
                    {p.cliente_nombre ?? "—"}
                    {p.origen === "ia" && <span className="ml-2 text-xs text-sky-600">IA</span>}
                  </td>
                  <td>{p.estado}</td>
                  <td>{formatoDinero(p.total)}</td>
                  <td>{formatoDinero(p.pagado)}</td>
                  <td className={p.saldo > 0 ? "font-medium" : "text-zinc-500"}>{formatoDinero(p.saldo)}</td>
                  <td>
                    {siguiente && (
                      <form action={cambiarEstadoPedido.bind(null, p.id, siguiente)}>
                        <button className="btn-secundario text-xs">→ {siguiente}</button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!data?.length && <p className="text-zinc-500">Todavía no hay pedidos.</p>}
    </>
  );
}
