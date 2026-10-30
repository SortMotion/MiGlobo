// Tipos escritos a mano a partir de supabase/migrations.
// Cuando el esquema crezca, conviene generarlos automáticamente:
//   npx supabase gen types typescript --project-id <id> > src/lib/database.types.ts

export type Canal = "whatsapp" | "instagram" | "facebook" | "web";
export type PedidoEstado = "pendiente" | "confirmado" | "listo" | "entregado" | "cancelado";

export type Negocio = {
  id: string;
  owner_id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  whatsapp_numero: string | null;
  whatsapp_phone_number_id: string | null;
  created_at: string;
};

export type Producto = {
  id: string;
  negocio_id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  foto_url: string | null;
  activo: boolean;
};

export type Mensaje = {
  id: string;
  canal: Canal;
  direccion: "entrante" | "saliente";
  texto: string | null;
  intencion: string | null;
  atendido: boolean;
  created_at: string;
  clientes: { nombre: string | null } | null;
};

export type PedidoResumen = {
  id: string;
  estado: PedidoEstado;
  origen: "manual" | "ia";
  total: number;
  pagado: number;
  saldo: number;
  notas: string | null;
  cliente_nombre: string | null;
  created_at: string;
};
