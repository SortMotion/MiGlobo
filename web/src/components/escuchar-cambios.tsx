"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Recarga la página cuando n8n (o alguien más) inserta/actualiza filas en la tabla.
export function EscucharCambios({ tabla, negocioId }: { tabla: "mensajes" | "pedidos"; negocioId: string }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const canal = supabase
      .channel(`${tabla}:${negocioId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tabla, filter: `negocio_id=eq.${negocioId}` },
        () => router.refresh(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [tabla, negocioId, router]);

  return null;
}
