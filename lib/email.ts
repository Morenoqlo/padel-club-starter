/**
 * Email service — powered by Resend
 * https://resend.com
 */

import { Resend } from "resend";
import { brandConfig } from "@/config/brand";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
const TO_CLUB = brandConfig.contact.email;

// ── Tipos ─────────────────────────────────────────────────────

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}

// ── Helpers ───────────────────────────────────────────────────

function formatPrice(n: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n);
}

function baseLayout(title: string, content: string) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#0A0A0A;padding:24px 32px;">
            <p style="margin:0;color:#22C55E;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">
              ${brandConfig.sport.icon} ${brandConfig.name}
            </p>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding:32px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9f9f9;padding:20px 32px;border-top:1px solid #eeeeee;">
            <p style="margin:0;font-size:12px;color:#999999;text-align:center;">
              ${brandConfig.name} · ${brandConfig.location.address}, ${brandConfig.location.commune}, ${brandConfig.location.city}<br/>
              ${brandConfig.contact.email} · ${brandConfig.contact.phone}
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Email: Contacto (al club) ─────────────────────────────────

export async function sendContactEmail(data: ContactEmailData) {
  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#0A0A0A;">
      Nuevo mensaje de contacto
    </h2>
    <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:24px;">
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
          <span style="font-size:12px;color:#999;font-weight:600;text-transform:uppercase;">Nombre</span><br/>
          <span style="font-size:15px;color:#0A0A0A;font-weight:500;">${data.name}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
          <span style="font-size:12px;color:#999;font-weight:600;text-transform:uppercase;">Email</span><br/>
          <a href="mailto:${data.email}" style="font-size:15px;color:#22C55E;">${data.email}</a>
        </td>
      </tr>
      ${data.phone ? `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
          <span style="font-size:12px;color:#999;font-weight:600;text-transform:uppercase;">Teléfono</span><br/>
          <span style="font-size:15px;color:#0A0A0A;">${data.phone}</span>
        </td>
      </tr>` : ""}
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
          <span style="font-size:12px;color:#999;font-weight:600;text-transform:uppercase;">Asunto</span><br/>
          <span style="font-size:15px;color:#0A0A0A;font-weight:500;">${data.subject}</span>
        </td>
      </tr>
    </table>
    <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">${data.message.replace(/\n/g, "<br/>")}</p>
    </div>
    <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}"
       style="display:inline-block;background:#22C55E;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">
      Responder a ${data.name}
    </a>
  `;

  return resend.emails.send({
    from: FROM,
    to: [TO_CLUB],
    replyTo: data.email,
    subject: `[Contacto Web] ${data.subject}`,
    html: baseLayout(`Nuevo mensaje: ${data.subject}`, content),
  });
}

// ── Email: Auto-respuesta al usuario ─────────────────────────

export async function sendContactAutoReply(data: ContactEmailData) {
  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0A0A0A;">
      ¡Gracias por escribirnos, ${data.name}!
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;">
      Recibimos tu mensaje y te responderemos a la brevedad, generalmente dentro de las próximas 24 horas hábiles.
    </p>
    <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin-bottom:24px;border-left:3px solid #22C55E;">
      <p style="margin:0 0 4px;font-size:12px;color:#999;font-weight:600;text-transform:uppercase;">Tu mensaje</p>
      <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">${data.message.replace(/\n/g, "<br/>")}</p>
    </div>
    <p style="margin:0 0 24px;font-size:14px;color:#555;line-height:1.6;">
      Si tienes urgencia, también puedes contactarnos por WhatsApp:
    </p>
    <a href="https://wa.me/${brandConfig.contact.whatsapp}?text=${encodeURIComponent(brandConfig.contact.whatsappMessage)}"
       style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">
      Escribir por WhatsApp
    </a>
  `;

  return resend.emails.send({
    from: FROM,
    to: [data.email],
    subject: `Recibimos tu mensaje — ${brandConfig.name}`,
    html: baseLayout("Gracias por contactarnos", content),
  });
}

// ── Email: Confirmación de orden ──────────────────────────────

export async function sendOrderConfirmation(data: OrderConfirmationData) {
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;">
          ${item.name}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#555;text-align:center;">
          ×${item.quantity}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#0A0A0A;text-align:right;font-weight:600;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join("");

  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0A0A0A;">
      ¡Orden confirmada! 🎉
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;">
      Hola ${data.customerName}, tu pago fue procesado exitosamente. Aquí está el resumen de tu orden:
    </p>

    <div style="background:#f9f9f9;border-radius:8px;padding:4px 16px;margin-bottom:24px;">
      <p style="font-size:12px;color:#999;font-weight:600;text-transform:uppercase;margin-bottom:4px;">
        Número de orden
      </p>
      <p style="font-family:monospace;font-size:13px;color:#333;margin:0 0 16px;">
        ${data.orderNumber}
      </p>
    </div>

    <table cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:16px;">
      <tr>
        <th style="text-align:left;font-size:12px;color:#999;font-weight:600;text-transform:uppercase;padding-bottom:8px;">Producto</th>
        <th style="text-align:center;font-size:12px;color:#999;font-weight:600;text-transform:uppercase;padding-bottom:8px;">Cant.</th>
        <th style="text-align:right;font-size:12px;color:#999;font-weight:600;text-transform:uppercase;padding-bottom:8px;">Subtotal</th>
      </tr>
      ${itemsHtml}
      <tr>
        <td colspan="2" style="padding:12px 0;font-size:15px;font-weight:700;color:#0A0A0A;">Total pagado</td>
        <td style="padding:12px 0;font-size:15px;font-weight:700;color:#22C55E;text-align:right;">${formatPrice(data.total)}</td>
      </tr>
    </table>

    <p style="margin:0 0 24px;font-size:14px;color:#555;line-height:1.6;">
      Nos pondremos en contacto contigo para coordinar la entrega. Si tienes alguna consulta, escríbenos a
      <a href="mailto:${TO_CLUB}" style="color:#22C55E;">${TO_CLUB}</a>.
    </p>

    <a href="${brandConfig.booking.externalUrl}"
       style="display:inline-block;background:#22C55E;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">
      Reservar una cancha
    </a>
  `;

  return resend.emails.send({
    from: FROM,
    to: [data.customerEmail],
    subject: `Orden confirmada #${data.orderNumber.slice(0, 8).toUpperCase()} — ${brandConfig.name}`,
    html: baseLayout("Orden confirmada", content),
  });
}
