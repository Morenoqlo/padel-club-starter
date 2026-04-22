"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { brandConfig } from "@/config/brand";
import {
  ShoppingBag, ArrowLeft, Minus, Plus, Trash2,
  CreditCard, Smartphone, Shield, CheckCircle2,
  ChevronRight, Lock,
} from "lucide-react";
import type { CheckoutFormData } from "@/types";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { StripePaymentForm } from "@/components/checkout/stripe-payment-form";

// Publishable key is safe to hardcode (it's public by design)
const STRIPE_PK =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51TOTp5DBhOhpEtKGfCm546iH76m0syya2UcmeeRJDWgV4rbVqOrBNyCq9lUEbvTCBKA5gr6hfmCKPgdFFcaYQR2e00K4I1IIYn";

const stripePromise = loadStripe(STRIPE_PK);

const ALL_PAYMENT_PROVIDERS = [
  {
    id: "stripe" as const,
    name: "Tarjeta de crédito / débito",
    description: "Visa, Mastercard, American Express",
    icon: CreditCard,
    badge: "Recomendado" as const,
    enabled: true,
  },
  {
    id: "mercadopago" as const,
    name: "Mercado Pago",
    description: "Paga en cuotas sin interés",
    icon: Smartphone,
    badge: null,
    // Only show if explicitly enabled via public env var
    enabled: process.env.NEXT_PUBLIC_MERCADOPAGO_ENABLED === "true",
  },
  {
    id: "transbank" as const,
    name: "Webpay / Transbank",
    description: "Débito y crédito chileno",
    icon: Shield,
    badge: null,
    enabled: process.env.NEXT_PUBLIC_TRANSBANK_ENABLED === "true",
  },
];

const PAYMENT_PROVIDERS = ALL_PAYMENT_PROVIDERS.filter((p) => p.enabled);

const CHILEAN_REGIONS = [
  "Región Metropolitana",
  "Región de Valparaíso",
  "Región de O'Higgins",
  "Región del Maule",
  "Región del Biobío",
  "Región de La Araucanía",
  "Región de Los Lagos",
  "Región de Aysén",
  "Región de Magallanes",
  "Región de Tarapacá",
  "Región de Antofagasta",
  "Región de Atacama",
  "Región de Coquimbo",
  "Región de Los Ríos",
  "Región de Arica y Parinacota",
  "Región de Ñuble",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart } = useCart();

  // Compute from items directly — Zustand getters don't survive Object.assign merges
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Wait for client mount so Zustand localStorage hydration is complete
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [form, setForm] = useState<CheckoutFormData>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    region: "Región Metropolitana",
    postalCode: "",
    paymentProvider: "stripe",
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [stripeOrderId, setStripeOrderId] = useState<string | null>(null);

  const shipping = 0; // free shipping
  const total = subtotal + shipping;

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    // Email
    if (!form.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      newErrors.email = "Ingresa un email válido (ej: juan@gmail.com)";
    }

    // Nombre
    if (!form.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    } else if (form.firstName.trim().length < 2) {
      newErrors.firstName = "Mínimo 2 caracteres";
    } else if (!/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]+$/.test(form.firstName.trim())) {
      newErrors.firstName = "Solo letras, sin números";
    }

    // Apellido
    if (!form.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    } else if (form.lastName.trim().length < 2) {
      newErrors.lastName = "Mínimo 2 caracteres";
    } else if (!/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]+$/.test(form.lastName.trim())) {
      newErrors.lastName = "Solo letras, sin números";
    }

    // Teléfono (opcional pero si lo ponen, que sea válido)
    if (form.phone?.trim()) {
      const digits = form.phone.replace(/\D/g, "");
      if (digits.length < 8 || digits.length > 15) {
        newErrors.phone = "Teléfono inválido (ej: +56 9 1234 5678)";
      }
    }

    // Dirección
    if (!form.address.trim()) {
      newErrors.address = "La dirección es requerida";
    } else if (form.address.trim().length < 5) {
      newErrors.address = "Ingresa una dirección completa";
    }

    // Ciudad
    if (!form.city.trim()) {
      newErrors.city = "La ciudad es requerida";
    } else if (form.city.trim().length < 2) {
      newErrors.city = "Ingresa una ciudad válida";
    } else if (!/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s']+$/.test(form.city.trim())) {
      newErrors.city = "Solo letras, sin números";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          customer: {
            email: form.email,
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone || undefined,
          },
          shippingAddress: {
            address: form.address,
            city: form.city,
            region: form.region,
          },
          paymentProvider: form.paymentProvider,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Error al procesar el pedido");
      }

      // MercadoPago — redirect to initPoint
      if (data?.provider === "mercadopago" && data?.initPoint) {
        clearCart();
        window.location.href = data.initPoint;
        return;
      }

      // Transbank — redirect with token to Webpay URL
      if (data?.provider === "transbank" && data?.url && data?.token) {
        clearCart();
        // Transbank requires a POST form redirect
        const form_el = document.createElement("form");
        form_el.method = "POST";
        form_el.action = data.url;
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "token_ws";
        input.value = data.token;
        form_el.appendChild(input);
        document.body.appendChild(form_el);
        form_el.submit();
        return;
      }

      // Stripe — show embedded payment form with clientSecret
      if (data?.provider === "stripe" && data?.clientSecret) {
        setStripeClientSecret(data.clientSecret);
        setStripeOrderId(data.orderId);
        return;
      }

      // If we get here, something went wrong — response didn't match any provider
      throw new Error(
        `La pasarela de pago "${form.paymentProvider}" no está configurada correctamente. Por favor intenta con otro método.`
      );
    } catch (err: any) {
      alert(err?.message ?? "Error al procesar el pedido. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleField = (field: keyof CheckoutFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ── Pre-hydration skeleton ────────────────────────────────────
  if (!mounted) {
    return <div className="pt-20 min-h-screen bg-secondary/30" />;
  }

  // ── Success state ─────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-6 py-16">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
            <CheckCircle2 className="h-10 w-10 text-accent" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-3">¡Pedido confirmado!</h1>
          <p className="text-muted-foreground mb-2">
            Te enviaremos la confirmación a <strong>{form.email}</strong>
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Nuestro equipo procesará tu pedido y te contactará a la brevedad.
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
        </div>
      </div>
    );
  }

  // ── Empty cart ────────────────────────────────────────────────
  if (itemCount === 0) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-sm px-6 py-16">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Tu carrito está vacío</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Agrega productos desde la tienda para continuar con tu compra.
          </p>
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Ir a la tienda
          </Link>
        </div>
      </div>
    );
  }

  // ── Stripe payment form ───────────────────────────────────────
  if (stripeClientSecret && stripePromise) {
    return (
      <div className="pt-20 min-h-screen bg-secondary/30">
        <div className="container py-10 md:py-14 max-w-xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => setStripeClientSecret(null)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al checkout
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-background p-6 md:p-8">
            <h1 className="font-display text-2xl font-bold mb-2">Ingresa tu tarjeta</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Total a pagar: <strong>{formatPrice(total)}</strong>
            </p>

            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: stripeClientSecret,
                appearance: {
                  theme: "night",
                  variables: {
                    colorPrimary: "#22C55E",
                    borderRadius: "12px",
                    fontFamily: "inherit",
                  },
                },
                locale: "es-419",
              }}
            >
              <StripePaymentForm
                total={total}
                orderId={stripeOrderId ?? ""}
                onClearCart={clearCart}
                onError={(msg) => alert(msg)}
              />
            </Elements>
          </div>
        </div>
      </div>
    );
  }

  // ── Main checkout ─────────────────────────────────────────────
  return (
    <div className="pt-20 min-h-screen bg-secondary/30">
      <div className="container py-10 md:py-14">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/tienda"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          <span className="text-sm font-medium">Checkout</span>
        </div>

        <h1 className="font-display text-3xl font-bold mb-8">Finalizar compra</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Left column — form */}
            <div className="space-y-6">
              {/* Contact info */}
              <div className="rounded-2xl border border-border bg-background p-6">
                <h2 className="font-display text-lg font-bold mb-5">Información de contacto</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleField("email", e.target.value)}
                      placeholder="tu@email.com"
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm bg-background outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent ${
                        errors.email ? "border-destructive" : "border-border"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Nombre <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => handleField("firstName", e.target.value)}
                        placeholder="Juan"
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm bg-background outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent ${
                          errors.firstName ? "border-destructive" : "border-border"
                        }`}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-xs text-destructive">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Apellido <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => handleField("lastName", e.target.value)}
                        placeholder="Pérez"
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm bg-background outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent ${
                          errors.lastName ? "border-destructive" : "border-border"
                        }`}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-xs text-destructive">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Teléfono <span className="text-muted-foreground text-xs font-normal">(opcional)</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleField("phone", e.target.value)}
                      placeholder="+56 9 1234 5678"
                      className="w-full rounded-xl border border-border px-4 py-2.5 text-sm bg-background outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping address */}
              <div className="rounded-2xl border border-border bg-background p-6">
                <h2 className="font-display text-lg font-bold mb-5">Dirección de envío</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Dirección <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => handleField("address", e.target.value)}
                      placeholder="Av. Deportiva 1234, Depto 5B"
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm bg-background outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent ${
                        errors.address ? "border-destructive" : "border-border"
                      }`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-destructive">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Ciudad <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => handleField("city", e.target.value)}
                        placeholder="Santiago"
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm bg-background outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent ${
                          errors.city ? "border-destructive" : "border-border"
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-1 text-xs text-destructive">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Código postal</label>
                      <input
                        type="text"
                        value={form.postalCode}
                        onChange={(e) => handleField("postalCode", e.target.value)}
                        placeholder="7500000"
                        className="w-full rounded-xl border border-border px-4 py-2.5 text-sm bg-background outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Región</label>
                    <select
                      value={form.region}
                      onChange={(e) => handleField("region", e.target.value)}
                      className="w-full rounded-xl border border-border px-4 py-2.5 text-sm bg-background outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                    >
                      {CHILEAN_REGIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Notas del pedido <span className="text-muted-foreground text-xs font-normal">(opcional)</span>
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => handleField("notes", e.target.value)}
                      placeholder="Instrucciones especiales de entrega…"
                      rows={3}
                      className="w-full rounded-xl border border-border px-4 py-2.5 text-sm bg-background outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment provider */}
              <div className="rounded-2xl border border-border bg-background p-6">
                <h2 className="font-display text-lg font-bold mb-5">Método de pago</h2>
                <div className="space-y-3">
                  {PAYMENT_PROVIDERS.map((provider) => {
                    const Icon = provider.icon;
                    const selected = form.paymentProvider === provider.id;
                    return (
                      <label
                        key={provider.id}
                        className={`flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                          selected
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentProvider"
                          value={provider.id}
                          checked={selected}
                          onChange={() => handleField("paymentProvider", provider.id)}
                          className="sr-only"
                        />
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          selected ? "bg-accent text-white" : "bg-secondary text-muted-foreground"
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">{provider.name}</p>
                            {provider.badge && (
                              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                                {provider.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{provider.description}</p>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          selected ? "border-accent" : "border-border"
                        }`}>
                          {selected && <div className="h-2.5 w-2.5 rounded-full bg-accent" />}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right column — order summary */}
            <div className="space-y-4">
              {/* Cart items */}
              <div className="rounded-2xl border border-border bg-background p-6 sticky top-24">
                <h2 className="font-display text-lg font-bold mb-5">
                  Tu pedido <span className="text-muted-foreground font-normal text-base">({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                </h2>

                <div className="space-y-4 max-h-72 overflow-y-auto pr-1 mb-5">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="flex items-start gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-secondary">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight line-clamp-2">{item.name}</p>
                        {item.variantName && (
                          <p className="text-xs text-muted-foreground mt-0.5">{item.variantName}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                            className="flex h-6 w-6 items-center justify-center rounded-md border border-border hover:bg-secondary transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                            className="flex h-6 w-6 items-center justify-center rounded-md border border-border hover:bg-secondary transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId, item.variantId)}
                            className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-muted-foreground">{formatPrice(item.price)} c/u</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="text-accent font-medium">Gratis</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Procesando…
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Confirmar pedido · {formatPrice(total)}
                    </>
                  )}
                </button>

                {/* Trust badges */}
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Pago seguro
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3" /> SSL encriptado
                  </span>
                </div>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Al confirmar aceptas los{" "}
                  <Link href="/terminos" className="underline hover:text-foreground">
                    términos y condiciones
                  </Link>{" "}
                  de {brandConfig.name}.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
