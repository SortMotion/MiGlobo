import { Suspense } from "react";
import { formatoDinero } from "@/lib/formato";
import { requireNegocio } from "@/lib/negocio";
import { createClient } from "@/lib/supabase/server";
import type { Producto } from "@/lib/types";
import { crearProducto } from "../actions";

export default function ProductosPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Productos</h1>

      <form action={crearProducto} className="tarjeta flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Nombre
          <input name="nombre" required className="input" />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Descripción
          <input name="descripcion" className="input" />
        </label>
        <label className="flex w-28 flex-col gap-1 text-sm">
          Precio
          <input name="precio" type="number" min="0" step="0.5" required className="input" />
        </label>
        <button className="btn-primario">Agregar</button>
      </form>

      <Suspense fallback={<p className="text-zinc-500">Cargando…</p>}>
        <ListaProductos />
      </Suspense>
    </>
  );
}

async function ListaProductos() {
  const negocio = await requireNegocio();
  const supabase = await createClient();
  const { data } = await supabase
    .from("productos")
    .select("*")
    .eq("negocio_id", negocio.id)
    .order("created_at")
    .returns<Producto[]>();

  // TODO (módulo Productos): editar, activar/desactivar y subir foto.
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {data?.map((p) => (
        <li key={p.id} className={`tarjeta ${p.activo ? "" : "opacity-50"}`}>
          <p className="font-medium">{p.nombre} · {formatoDinero(p.precio)}</p>
          {p.descripcion && <p className="text-sm text-zinc-500">{p.descripcion}</p>}
        </li>
      ))}
    </ul>
  );
}
