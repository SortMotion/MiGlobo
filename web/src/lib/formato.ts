const dinero = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });
const fechaHora = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Mexico_City",
});

export const formatoDinero = (n: number) => dinero.format(n);
export const formatoFecha = (iso: string) => fechaHora.format(new Date(iso));
