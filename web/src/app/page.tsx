import Link from "next/link";

const modulos = [
  { titulo: "Mensajes", texto: "Los chats de WhatsApp (y luego Instagram y Facebook) en una sola bandeja." },
  { titulo: "Pedidos", texto: "La IA detecta cuando alguien pide algo y lo registra por ti." },
  { titulo: "Anticipos", texto: "Cuánto te pagaron, cuánto falta y con qué comprobante." },
  { titulo: "Entregas", texto: "Dónde y a qué hora entregas, sin perderte en el chat." },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-12 px-6 py-20">
      <header className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">MiGlobo</h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Para estudiantes que venden por redes sociales: deja la libreta y
          gestiona tus ventas desde un solo lugar.
        </p>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-full bg-foreground px-5 py-2.5 font-medium text-background"
          >
            Entrar
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {modulos.map((m) => (
          <article
            key={m.titulo}
            className="rounded-xl border border-black/10 p-5 dark:border-white/15"
          >
            <h2 className="font-semibold">{m.titulo}</h2>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">{m.texto}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
