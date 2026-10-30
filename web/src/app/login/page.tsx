import { Suspense } from "react";
import { iniciarSesion, registrarse } from "./actions";

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold">Entra a MiGlobo</h1>

      {/* searchParams se lee por request, por eso va dentro de Suspense. */}
      <Suspense>
        <Avisos searchParams={searchParams} />
      </Suspense>

      <form className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Correo
          <input name="email" type="email" required className="input" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Contraseña
          <input name="password" type="password" required minLength={6} className="input" />
        </label>
        <button formAction={iniciarSesion} className="btn-primario mt-2">
          Iniciar sesión
        </button>
        <button formAction={registrarse} className="btn-secundario">
          Crear cuenta
        </button>
      </form>
    </main>
  );
}

async function Avisos({ searchParams }: { searchParams: PageProps<"/login">["searchParams"] }) {
  const { error, aviso } = await searchParams;
  if (typeof error === "string") return <p className="aviso-error">{error}</p>;
  if (typeof aviso === "string") return <p className="aviso">{aviso}</p>;
  return null;
}
