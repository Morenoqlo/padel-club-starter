import Link from "next/link";
import { Clock } from "lucide-react";
import { brandConfig } from "@/config/brand";

export const metadata = {
  title: "Pago pendiente",
  robots: { index: false },
};

export default async function CheckoutPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const orderNumber = order?.slice(0, 8).toUpperCase();

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-6 py-16">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10">
          <Clock className="h-10 w-10 text-yellow-500" />
        </div>

        <h1 className="font-display text-3xl font-bold mb-3">Pago en revisión</h1>

        {orderNumber && (
          <p className="text-sm text-muted-foreground mb-2 font-mono">
            Orden #{orderNumber}
          </p>
        )}

        <p className="text-muted-foreground mb-2">
          Tu pago está siendo procesado por Mercado Pago.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Te notificaremos por email cuando se confirme. Esto suele tardar entre unos
          minutos y 24 horas hábiles según el método de pago elegido.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
          >
            Ir al inicio
          </Link>
          <Link
            href="/tienda"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-secondary transition-colors"
          >
            Seguir comprando
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
          ¿Preguntas? Escríbenos a{" "}
          <a href={`mailto:${brandConfig.contact.email}`} className="text-accent hover:underline">
            {brandConfig.contact.email}
          </a>
        </div>
      </div>
    </div>
  );
}
