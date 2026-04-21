export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Transbank Webpay return handler
 * ────────────────────────────────
 * Transbank POST to this URL after the user completes (or cancels) payment.
 * We confirm the transaction and update the order accordingly.
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const tokenWs = formData.get("token_ws") as string | null;
  const tbkToken = formData.get("TBK_TOKEN") as string | null;      // cancelled
  const tbkOrdenCompra = formData.get("TBK_ORDEN_COMPRA") as string | null; // cancelled

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // ── Cancelled by user ────────────────────────────────────────
  if (!tokenWs && tbkToken) {
    const orderId = tbkOrdenCompra ?? "";
    if (orderId) {
      const supabase = await createServiceClient();
      await (supabase as any)
        .from("orders")
        .update({ status: "cancelled", payment_status: "failed" })
        .eq("id", orderId);
    }
    return NextResponse.redirect(`${baseUrl}/checkout/failure?reason=cancelled`);
  }

  if (!tokenWs) {
    return NextResponse.redirect(`${baseUrl}/checkout/failure?reason=no_token`);
  }

  // ── Confirm transaction ───────────────────────────────────────
  try {
    const { tbkConfirmTransaction } = await import("@/lib/payments/transbank");
    const result = await tbkConfirmTransaction(tokenWs);

    const supabase = await createServiceClient();
    const orderId = result?.buy_order;

    if (result?.response_code === 0) {
      // Success
      await (supabase as any)
        .from("orders")
        .update({
          status: "paid",
          payment_status: "paid",
          payment_intent_id: tokenWs,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      return NextResponse.redirect(`${baseUrl}/checkout/success?order=${orderId}`);
    } else {
      // Failed
      await (supabase as any)
        .from("orders")
        .update({ status: "cancelled", payment_status: "failed" })
        .eq("id", orderId);

      return NextResponse.redirect(`${baseUrl}/checkout/failure?order=${orderId}`);
    }
  } catch (err) {
    console.error("[Transbank return]", err);
    return NextResponse.redirect(`${baseUrl}/checkout/failure?reason=error`);
  }
}

// Transbank also does GET for some flows
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tbkToken = searchParams.get("TBK_TOKEN");
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (tbkToken) {
    return NextResponse.redirect(`${baseUrl}/checkout/failure?reason=cancelled`);
  }

  return NextResponse.redirect(`${baseUrl}/checkout/failure?reason=unknown`);
}
