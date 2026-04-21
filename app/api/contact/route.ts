import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { sendContactEmail, sendContactAutoReply } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    // ── Send emails via Resend ────────────────────────
    if (process.env.RESEND_API_KEY) {
      await Promise.all([
        sendContactEmail(data),
        sendContactAutoReply(data),
      ]);
    } else {
      // Log to console in development when Resend is not configured
      console.log("[Contact Form] (no RESEND_API_KEY)", data);
    }

    return NextResponse.json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error("[Contact API]", error);
    return NextResponse.json(
      { error: "Error al procesar el mensaje" },
      { status: 400 }
    );
  }
}
