import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { requireNegocio } from "@/lib/negocio";

export default function ResumenPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Resumen</h1>
      <Suspense fallback={<p className="text-zinc-500">Cargando…</p>}>
        <Indicadores />
      </Suspense>
    </>
  );
}

async function Indicadores() {
  const negocio = await requireNegocio();
  const supabase = await createClient();

  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);
  const finHoy = new Date(inicioHoy);
  finHoy.setDate(finHoy.getDate() + 1);

  const [sinAtender, pendientes, entregasHoy] = await Promise.all([
    supabase
      .from("mensajes")
      .select("id", { count: "exact", head: true })
      .eq("negocio_id", negocio.id)
      .eq("direccion", "entrante")
      .eq("atendido", false),
    supabase
      .from("pedidos")
      .select("id", { count: "exact", head: true })
      .eq("negocio_id", negocio.id)
      .in("estado", ["pendiente", "confirmado", "listo"]),
    supabase
      .from("entregas")
      .select("id, pedidos!inner(negocio_id)", { count: "exact", head: true })
      .eq("pedidos.negocio_id", negocio.id)
      .eq("estado", "programada")
      .gte("fecha_hora", inicioHoy.toISOString())
      .lt("fecha_hora", finHoy.toISOString()),
  ]);

  const tarjetas = [
    { label: "Mensajes sin atender", valor: sinAtender.count ?? 0, href: "/panel/mensajes" },
    { label: "Pedidos abiertos", valor: pendientes.count ?? 0, href: "/panel/pedidos" },
    { label: "Entregas hoy", valor: entregasHoy.count ?? 0, href: "/panel/entregas" },
  ];

  return (
    <>
      <p className="text-zinc-600 dark:text-zinc-400">
        {negocio.nombre} · tu página pública:{" "}
        <Link href={`/t/${negocio.slug}`} className="underline">
          /t/{negocio.slug}
        </Link>
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {tarjetas.map((t) => (
          <Link key={t.label} href={t.href} className="tarjeta">
            <p className="text-sm text-zinc-500">{t.label}</p>
            <p className="text-3xl font-semibold">{t.valor}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
