import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { brandConfig } from "@/config/brand";

export const metadata = {
  title: "Pedido confirmado",
  robots: { index: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const orderNumber = order?.slice(0, 8).toUpperCase();

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-6 py-16">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
          <CheckCircle2 className="h-10 w-10 text-accent" />
        </div>

        <h1 className="font-display text-3xl font-bold mb-3">¡Pedido confirmado!</h1>

        {orderNumber && (
          <p className="text-sm text-muted-foreground mb-2 font-mono">
            Orden #{orderNumber}
          </p>
        )}

        <p className="text-muted-foreground mb-2">
          Tu pago fue procesado exitosamente.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Recibirás un email de confirmación con el resumen de tu pedido. Nuestro equipo
          te contactará pronto para coordinar la entrega.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/tienda"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
          >
            Seguir comprando
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-secondary transition-colors"
          >
            Ir al inicio
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
          ¿Preguntas? Contáctanos en{" "}
          <a href={`mailto:${brandConfig.contact.email}`} className="text-accent hover:underline">
            {brandConfig.contact.email}
          </a>
        </div>
      </div>
    </div>
  );
}
