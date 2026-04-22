export const dynamic = "force-dynamic";

import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, Mail } from "lucide-react";
import { brandConfig } from "@/config/brand";
import { createServiceClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Pedido confirmado",
  robots: { index: false },
};

interface OrderItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  subtotal: number;
  status: string;
  payment_provider: string;
  created_at: string;
  order_items: OrderItem[];
}

async function getOrder(orderId: string): Promise<Order | null> {
  try {
    const supabase = await createServiceClient();
    const { data } = await (supabase as any)
      .from("orders")
      .select("id, customer_name, customer_email, total, subtotal, status, payment_provider, created_at, order_items(product_name, quantity, unit_price, total_price)")
      .eq("id", orderId)
      .single();
    return data ?? null;
  } catch {
    return null;
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  const order = orderId ? await getOrder(orderId) : null;
  const orderNumber = orderId?.slice(0, 8).toUpperCase() ?? "—";

  return (
    <div className="pt-20 min-h-screen bg-secondary/30">
      <div className="container py-12 max-w-2xl mx-auto">

        {/* Success header */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
            <CheckCircle2 className="h-10 w-10 text-accent" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">¡Pedido confirmado!</h1>
          <p className="text-muted-foreground">
            Orden <span className="font-mono font-semibold text-foreground">#{orderNumber}</span>
          </p>
        </div>

        {/* Order details card */}
        <div className="rounded-2xl border border-border bg-background overflow-hidden mb-5">
          {/* Items */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-sm">Productos</h2>
            </div>

            {order?.order_items && order.order_items.length > 0 ? (
              <div className="space-y-3">
                {order.order_items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.product_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {formatPrice(item.unit_price)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">{formatPrice(item.total_price)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Procesando detalles del pedido…</p>
            )}
          </div>

          {/* Totals */}
          <div className="p-6 border-b border-border bg-secondary/20 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(order?.subtotal ?? order?.total ?? 0)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Envío</span>
              <span className="text-accent font-medium">Gratis</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
              <span>Total pagado</span>
              <span>{formatPrice(order?.total ?? 0)}</span>
            </div>
          </div>

          {/* Customer info */}
          {order && (
            <div className="p-6">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{order.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Recibirás la confirmación en este correo
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next steps */}
        <div className="rounded-2xl border border-border bg-background p-5 mb-8 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">¿Qué sigue?</p>
          <p>
            Nuestro equipo procesará tu pedido y se pondrá en contacto contigo pronto.
            ¿Tienes preguntas? Escríbenos a{" "}
            <a href={`mailto:${brandConfig.contact.email}`} className="text-accent hover:underline">
              {brandConfig.contact.email}
            </a>
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/tienda"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
          >
            Seguir comprando
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-3 text-sm font-semibold hover:bg-secondary transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
