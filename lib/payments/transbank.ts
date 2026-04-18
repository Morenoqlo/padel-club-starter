/**
 * Transbank / Webpay Plus integration (Chile)
 * Docs: https://www.transbankdevelopers.cl/documentacion/webpay-plus
 *
 * Install: npm install transbank-sdk
 */

const TRANSBANK_API_URL =
  process.env.TRANSBANK_ENVIRONMENT === "production"
    ? "https://webpay3g.transbank.cl"
    : "https://webpay3gint.transbank.cl";

const COMMERCE_CODE = process.env.TRANSBANK_COMMERCE_CODE!;
const API_KEY = process.env.TRANSBANK_API_KEY!;

export async function tbkCreateTransaction(params: {
  buyOrder: string;
  sessionId: string;
  amount: number;
  returnUrl: string;
}) {
  const response = await fetch(
    `${TRANSBANK_API_URL}/rswebpaytransaction/api/webpay/v1.2/transactions`,
    {
      method: "POST",
      headers: {
        "Tbk-Api-Key-Id": COMMERCE_CODE,
        "Tbk-Api-Key-Secret": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        buy_order: params.buyOrder,
        session_id: params.sessionId,
        amount: params.amount,
        return_url: params.returnUrl,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Transbank: error creating transaction");
  }

  return response.json() as Promise<{ token: string; url: string }>;
}

export async function tbkConfirmTransaction(token: string) {
  const response = await fetch(
    `${TRANSBANK_API_URL}/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`,
    {
      method: "PUT",
      headers: {
        "Tbk-Api-Key-Id": COMMERCE_CODE,
        "Tbk-Api-Key-Secret": API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Transbank: error confirming transaction");
  }

  return response.json();
}
