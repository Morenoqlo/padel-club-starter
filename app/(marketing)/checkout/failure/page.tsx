import Link from "next/link";
import { XCircle } from "lucide-react";
import { brandConfig } from "@/config/brand";

export const metadata = {
  title: "Pago fallido",
  robots: { index: false },
};

const REASON_MESSAGES: Record<string, string> = {
  cancelled: "Cancelaste el proceso de pago.",
  no_token: "No se recibió confirmación del proveedor de pago.",
  error: "Ocurrió un error al procesar tu pago.",
};

export default async function CheckoutFailurePage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; reason?: string }>;
}) {
  const { reason } = await searchParams;
  const message = reason
    ? REASON_MESSAGES[reason] ?? "Tu pago no pudo ser procesado."
    : "Tu pago no pudo ser procesado.";

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-6 py-16">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-10 w-10 text-destructive" />
        </div>

        <h1 className="font-display text-3xl font-bold mb-3">Pago no completado</h1>
        <p className="text-muted-foreground mb-8">{message} Puedes intentarlo nuevamente.</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
          >
            Intentar de nuevo
          </Link>
          <Link
            href="/tienda"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-secondary transition-colors"
          >
            Volver a la tienda
          </Link>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
          ¿Necesitas ayuda?{" "}
          <a href={`mailto:${brandConfig.contact.email}`} className="text-accent hover:underline">
            Contáctanos
          </a>{" "}
          o escríbenos por WhatsApp.
        </div>
      </div>
    </div>
  );
}
