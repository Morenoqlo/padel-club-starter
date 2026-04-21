"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Lock, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface StripePaymentFormProps {
  total: number;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export function StripePaymentForm({ total, onSuccess, onError }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: "if_required",
      });

      if (error) {
        onError(error.message ?? "Error al procesar el pago");
      } else {
        onSuccess();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: "tabs",
          defaultValues: { billingDetails: { address: { country: "CL" } } },
        }}
      />

      <button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Procesando…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Pagar {formatPrice(total)}
          </>
        )}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Pago seguro procesado por Stripe · SSL encriptado
      </p>
    </form>
  );
}
