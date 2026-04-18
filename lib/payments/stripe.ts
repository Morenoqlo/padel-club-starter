import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return stripeInstance;
}

export async function createPaymentIntent(
  amount: number,
  currency: string = "clp",
  metadata?: Record<string, string>
) {
  const stripe = getStripe();
  return stripe.paymentIntents.create({
    amount: Math.round(amount),
    currency,
    automatic_payment_methods: { enabled: true },
    metadata,
  });
}

export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}
