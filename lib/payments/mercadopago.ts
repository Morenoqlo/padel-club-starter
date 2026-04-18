/**
 * MercadoPago integration
 * Docs: https://www.mercadopago.cl/developers/es/docs
 *
 * Install: npm install mercadopago
 */

export interface MPPreference {
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    currency_id?: string;
  }>;
  payer?: {
    email: string;
    name?: string;
  };
  back_urls?: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return?: "approved" | "all";
  external_reference?: string;
}

export async function createMPPreference(preference: MPPreference) {
  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(preference),
  });

  if (!response.ok) {
    throw new Error("MercadoPago: error creating preference");
  }

  return response.json() as Promise<{ id: string; init_point: string }>;
}
