"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function leerCredenciales(formData: FormData) {
  return {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
}

export async function iniciarSesion(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(leerCredenciales(formData));
  if (error) redirect("/login?error=" + encodeURIComponent("Correo o contraseña incorrectos"));
  redirect("/panel");
}

export async function registrarse(formData: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(leerCredenciales(formData));
  if (error) redirect("/login?error=" + encodeURIComponent(error.message));
  // Si el proyecto pide confirmar el correo, todavía no hay sesión.
  if (!data.session) {
    redirect("/login?aviso=" + encodeURIComponent("Revisa tu correo para confirmar la cuenta"));
  }
  redirect("/panel");
}

export async function cerrarSesion() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
