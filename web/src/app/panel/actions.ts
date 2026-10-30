"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireNegocio } from "@/lib/negocio";
import type { PedidoEstado } from "@/lib/types";

const texto = (formData: FormData, campo: string) => {
  const valor = String(formData.get(campo) ?? "").trim();
  return valor === "" ? null : valor;
};

export async function crearNegocio(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("negocios").insert({
    nombre: texto(formData, "nombre"),
    slug: texto(formData, "slug")?.toLowerCase(),
    whatsapp_numero: texto(formData, "whatsapp_numero")?.replace(/\D/g, ""),
  });
  // TODO: mostrar el error en el formulario (p. ej. slug repetido) con useActionState.
  if (error) throw new Error(error.message);
  revalidatePath("/panel", "layout");
}

export async function crearProducto(formData: FormData) {
  const negocio = await requireNegocio();
  const supabase = await createClient();
  const { error } = await supabase.from("productos").insert({
    negocio_id: negocio.id,
    nombre: texto(formData, "nombre"),
    descripcion: texto(formData, "descripcion"),
    precio: Number(formData.get("precio")),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/panel/productos");
}

export async function cambiarEstadoPedido(pedidoId: string, estado: PedidoEstado) {
  const supabase = await createClient();
  const { error } = await supabase.from("pedidos").update({ estado }).eq("id", pedidoId);
  if (error) throw new Error(error.message);
  revalidatePath("/panel/pedidos");
}

export async function marcarAtendido(mensajeId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("mensajes").update({ atendido: true }).eq("id", mensajeId);
  if (error) throw new Error(error.message);
  revalidatePath("/panel/mensajes");
}
