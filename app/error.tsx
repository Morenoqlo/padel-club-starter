"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <p className="font-display text-7xl font-black text-destructive">500</p>
      <h1 className="mt-4 font-display text-2xl font-bold">Algo salió mal</h1>
      <p className="mt-2 text-muted-foreground max-w-sm">
        Ocurrió un error inesperado. Puedes intentar de nuevo o volver al inicio.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-secondary transition-colors"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
