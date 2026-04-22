export const dynamic = "force-dynamic";
/* eslint-disable @typescript-eslint/no-explicit-any */
// Note: Some Supabase type inference is suppressed here because this route
// requires a real Supabase connection. Types are verified at runtime.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { absoluteUrl } from "@/lib/utils";

const checkoutBodySchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      quantity: z.number().positive(),
    })
  ),
  customer: z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().optional(),
  }),
  shippingAddress: z.object({
    address: z.string(),
    city: z.string(),
    region: z.string(),
  }),
  paymentProvider: z.enum(["stripe", "mercadopago", "transbank"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = checkoutBodySchema.parse(body);
    const supabase = await createServiceClient();

    // Fetch product prices server-side (never trust client prices)
    const productIds = data.items.map((i) => i.productId);
    const { data: productsRaw, error: productsError } = await supabase
      .from("products")
      .select("id, name, price, images, slug")
      .in("id", productIds)
      .eq("is_active", true);

    const products = productsRaw as Array<{ id: string; name: string; price: number; images: string[]; slug: string }> | null;

    if (productsError || !products) {
      return NextResponse.json({ error: "Productos no encontrados" }, { status: 400 });
    }

    // Build order items with server-verified prices
    const orderItems = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      return {
        product_id: item.productId,
        variant_id: item.variantId,
        product_name: product.name,
        quantity: item.quantity,
        unit_price: product.price,
        total_price: product.price * item.quantity,
      };
    });

    const subtotal = orderItems.reduce((acc, i) => acc + i.total_price, 0);
    const total = subtotal; // Add shipping logic here

    // Create order in DB
    const { data: orderRaw, error: orderError } = await (supabase as any)
      .from("orders")
      .insert({
        customer_email: data.customer.email,
        customer_name: `${data.customer.firstName} ${data.customer.lastName}`,
        customer_phone: data.customer.phone,
        status: "pending",
        payment_status: "pending",
        payment_provider: data.paymentProvider,
        subtotal,
        shipping_cost: 0,
        tax: 0,
        total,
        shipping_address: data.shippingAddress,
      })
      .select()
      .single();

    const order = orderRaw as { id: string } | null;
    if (orderError || !order) {
      return NextResponse.json({ error: "Error creando orden" }, { status: 500 });
    }

    // Create order items
    await (supabase as any).from("order_items").insert(
      orderItems.map((item) => ({ ...item, order_id: order.id }))
    );

    // ── Validar stock (sin descontar — el webhook lo hace al confirmar el pago) ──
    for (const item of data.items) {
      const product = products!.find((p) => p.id === item.productId);
      if (!product) continue;
      const { data: prod } = await (supabase as any)
        .from("products")
        .select("stock_quantity")
        .eq("id", item.productId)
        .single();

      if (prod?.stock_quantity != null && prod.stock_quantity < item.quantity) {
        await (supabase as any).from("orders").update({ status: "cancelled" }).eq("id", order.id);
        return NextResponse.json(
          { error: `Stock insuficiente para "${product.name}"` },
          { status: 400 }
        );
      }
    }

    // ── Route to payment provider ─────────────────────────
    if (data.paymentProvider === "stripe") {
      if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json({ error: "Stripe no está configurado. Agrega STRIPE_SECRET_KEY en las variables de entorno." }, { status: 500 });
      }
      const { createPaymentIntent } = await import("@/lib/payments/stripe");
      // CLP es moneda de cero decimales en Stripe — NO multiplicar por 100
      const intent = await createPaymentIntent(Math.round(total), "clp", {
        orderId: order.id,
      });
      return NextResponse.json({
        orderId: order.id,
        clientSecret: intent.client_secret,
        provider: "stripe",
      });
    }

    if (data.paymentProvider === "mercadopago") {
      const { createMPPreference } = await import("@/lib/payments/mercadopago");
      const pref = await createMPPreference({
        items: orderItems.map((item) => ({
          id: item.product_id,
          title: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: "CLP",
        })),
        payer: { email: data.customer.email },
        back_urls: {
          success: absoluteUrl(`/checkout/success?order=${order.id}`),
          failure: absoluteUrl(`/checkout/failure?order=${order.id}`),
          pending: absoluteUrl(`/checkout/pending?order=${order.id}`),
        },
        external_reference: order.id,
      });
      return NextResponse.json({
        orderId: order.id,
        initPoint: pref.init_point,
        provider: "mercadopago",
      });
    }

    if (data.paymentProvider === "transbank") {
      const { tbkCreateTransaction } = await import("@/lib/payments/transbank");
      const txn = await tbkCreateTransaction({
        buyOrder: order.id.slice(0, 26),
        sessionId: order.id,
        amount: total,
        returnUrl: absoluteUrl(`/api/transbank/return`),
      });
      return NextResponse.json({
        orderId: order.id,
        token: txn.token,
        url: txn.url,
        provider: "transbank",
      });
    }

    return NextResponse.json({ error: "Proveedor de pago no soportado" }, { status: 400 });
  } catch (error: any) {
    console.error("[Checkout API]", error);
    const msg = error?.message ?? "Error interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
