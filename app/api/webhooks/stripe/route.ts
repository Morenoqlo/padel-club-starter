import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendOrderConfirmation } from "@/lib/email";

/**
 * Stripe Webhook Handler
 * ─────────────────────
 * Configura en: https://dashboard.stripe.com/webhooks
 * URL: https://tudominio.com/api/webhooks/stripe
 * Eventos a escuchar:
 *   - payment_intent.succeeded
 *   - payment_intent.payment_failed
 *   - charge.refunded
 *
 * Variables de entorno necesarias:
 *   STRIPE_SECRET_KEY=sk_live_...
 *   STRIPE_WEBHOOK_SECRET=whsec_...
 */

export async function POST(req: NextRequest) {
  // Si no hay Stripe configurado, devolver 200 para no bloquear
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn("[Stripe Webhook] No configurado — agrega STRIPE_SECRET_KEY y STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ received: true });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: any;

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-02-24.acacia" });
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature error:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const supabase = await createServiceClient();

  try {
    switch (event.type) {
      // ── Pago exitoso ──────────────────────────────────────────
      case "payment_intent.succeeded": {
        const intent = event.data.object;
        const orderId = intent.metadata?.orderId;

        if (!orderId) {
          console.warn("[Stripe] payment_intent sin orderId en metadata");
          break;
        }

        // Actualizar orden: status paid
        const { error } = await (supabase as any)
          .from("orders")
          .update({
            status: "paid",
            payment_status: "paid",
            payment_intent_id: intent.id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        if (error) {
          console.error("[Stripe] Error actualizando orden:", error.message);
        } else {
          console.log(`[Stripe] Orden ${orderId} marcada como pagada`);

          // Descontar stock de los productos
          await decrementStock(supabase, orderId);

          // Enviar email de confirmación al cliente
          await sendOrderConfirmationEmail(supabase, orderId);
        }
        break;
      }

      // ── Pago fallido ──────────────────────────────────────────
      case "payment_intent.payment_failed": {
        const intent = event.data.object;
        const orderId = intent.metadata?.orderId;

        if (orderId) {
          await (supabase as any)
            .from("orders")
            .update({
              status: "cancelled",
              payment_status: "failed",
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId);
          console.log(`[Stripe] Orden ${orderId} marcada como fallida`);
        }
        break;
      }

      // ── Reembolso ─────────────────────────────────────────────
      case "charge.refunded": {
        const charge = event.data.object;
        const intentId = charge.payment_intent;

        if (intentId) {
          await (supabase as any)
            .from("orders")
            .update({
              status: "refunded",
              payment_status: "refunded",
              updated_at: new Date().toISOString(),
            })
            .eq("payment_intent_id", intentId);
          console.log(`[Stripe] Reembolso procesado para intent ${intentId}`);
        }
        break;
      }

      default:
        // Ignorar otros eventos
        break;
    }
  } catch (err: any) {
    console.error("[Stripe Webhook] Error procesando evento:", err);
    return NextResponse.json({ error: "Processing error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/** Envía email de confirmación de orden al cliente */
async function sendOrderConfirmationEmail(supabase: any, orderId: string) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    const { data: order } = await supabase
      .from("orders")
      .select("id, customer_name, customer_email, total")
      .eq("id", orderId)
      .single();

    if (!order) return;

    const { data: items } = await supabase
      .from("order_items")
      .select("product_name, quantity, unit_price")
      .eq("order_id", orderId);

    if (!items || items.length === 0) return;

    await sendOrderConfirmation({
      orderNumber: orderId,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      items: items.map((i: any) => ({
        name: i.product_name,
        quantity: i.quantity,
        price: i.unit_price,
      })),
      total: order.total,
    });

    console.log(`[Stripe] Email de confirmación enviado a ${order.customer_email}`);
  } catch (err) {
    console.error("[Stripe] Error enviando email de confirmación:", err);
  }
}

/** Descuenta stock de los productos de una orden */
async function decrementStock(supabase: any, orderId: string) {
  const { data: items } = await supabase
    .from("order_items")
    .select("product_id, quantity")
    .eq("order_id", orderId);

  if (!items || items.length === 0) return;

  for (const item of items) {
    // Solo decrementa si stock_quantity no es null
    const { data: product } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", item.product_id)
      .single();

    if (product?.stock_quantity != null) {
      const newStock = Math.max(0, product.stock_quantity - item.quantity);
      await supabase
        .from("products")
        .update({ stock_quantity: newStock })
        .eq("id", item.product_id);
    }
  }
}
