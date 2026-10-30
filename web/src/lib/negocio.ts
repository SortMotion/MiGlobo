import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Negocio } from "@/lib/types";

// Capa de acceso a datos: todas las páginas del panel pasan por aquí
// para saber quién es el usuario y cuál es su negocio.
export async function getUsuario() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login");
  return { id: data.claims.sub, email: data.claims.email as string | undefined };
}

export async function getMiNegocio(): Promise<Negocio | null> {
  const usuario = await getUsuario();
  const supabase = await createClient();
  const { data } = await supabase
    .from("negocios")
    .select("*")
    .eq("owner_id", usuario.id)
    .maybeSingle();
  return data;
}

// Para páginas que no tienen sentido sin negocio.
export async function requireNegocio(): Promise<Negocio> {
  const negocio = await getMiNegocio();
  if (!negocio) redirect("/panel");
  return negocio;
}
