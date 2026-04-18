import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { brandConfig } from "@/config/brand";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    // ── Send email via Resend ─────────────────────────
    // Install: npm install resend
    // Uncomment when Resend is configured:
    /*
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: [brandConfig.contact.email],
      subject: `[Contacto Web] ${data.subject}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Teléfono:</strong> ${data.phone ?? "—"}</p>
        <p><strong>Asunto:</strong> ${data.subject}</p>
        <hr />
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      `,
    });
    */

    // For now, log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Contact Form]", data);
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
