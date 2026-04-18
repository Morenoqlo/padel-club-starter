import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="font-display text-8xl font-black text-accent">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold">Página no encontrada</h1>
      <p className="mt-2 text-muted-foreground max-w-sm">
        La página que buscas no existe o fue movida.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
