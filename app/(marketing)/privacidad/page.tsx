import type { Metadata } from "next";
import { brandConfig } from "@/config/brand";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: `Política de privacidad y protección de datos de ${brandConfig.name}`,
};

export default function PrivacidadPage() {
  const updated = "18 de abril de 2025";

  return (
    <div className="pt-20">
      <section className="section-sm border-b border-border bg-secondary/30">
        <div className="container max-w-3xl">
          <p className="label-overline mb-3">Legal</p>
          <h1 className="heading-xl">Política de Privacidad</h1>
          <p className="mt-3 text-sm text-muted-foreground">Última actualización: {updated}</p>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-3xl prose prose-sm dark:prose-invert">

          <h2>1. Responsable del tratamiento</h2>
          <p>
            <strong>{brandConfig.legal.companyName}</strong> (RUT {brandConfig.legal.rut}),
            con domicilio en {brandConfig.location.address}, {brandConfig.location.commune},{" "}
            {brandConfig.location.city}, es el responsable del tratamiento de tus datos personales.
          </p>
          <p>
            Contacto de privacidad:{" "}
            <a href={`mailto:${brandConfig.legal.privacyEmail}`}>{brandConfig.legal.privacyEmail}</a>
          </p>

          <h2>2. Datos que recopilamos</h2>
          <p>Recopilamos los siguientes datos personales:</p>
          <ul>
            <li><strong>Datos de contacto:</strong> nombre, email, teléfono (al usar el formulario de contacto)</li>
            <li><strong>Datos de compra:</strong> nombre, email, teléfono, dirección de envío (al realizar una compra)</li>
            <li><strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas (cookies de análisis)</li>
            <li><strong>Datos de pago:</strong> procesados directamente por el proveedor de pago (no almacenamos datos de tarjeta)</li>
          </ul>

          <h2>3. Finalidad del tratamiento</h2>
          <p>Usamos tus datos para:</p>
          <ul>
            <li>Procesar y gestionar tus pedidos y pagos</li>
            <li>Responder consultas enviadas por el formulario de contacto</li>
            <li>Enviarte confirmaciones de orden y actualizaciones relevantes</li>
            <li>Mejorar nuestros servicios mediante análisis de uso del sitio</li>
            <li>Cumplir obligaciones legales y contables</li>
          </ul>

          <h2>4. Base legal</h2>
          <p>
            El tratamiento de tus datos se basa en: (a) la ejecución de un contrato cuando realizas una
            compra, (b) tu consentimiento para comunicaciones de marketing, y (c) el cumplimiento de
            obligaciones legales bajo la Ley N° 19.628 de Protección de Datos Personales de Chile.
          </p>

          <h2>5. Compartición de datos</h2>
          <p>
            Tus datos pueden ser compartidos con:
          </p>
          <ul>
            <li><strong>Proveedores de pago</strong> (Stripe, MercadoPago, Transbank) — para procesar pagos</li>
            <li><strong>Servicios de email</strong> (Resend) — para enviar confirmaciones</li>
            <li><strong>Supabase</strong> — para almacenamiento seguro de datos</li>
            <li><strong>Autoridades</strong> — cuando lo exija la ley</li>
          </ul>
          <p>No vendemos ni cedemos tus datos a terceros con fines comerciales.</p>

          <h2>6. Retención de datos</h2>
          <p>
            Conservamos tus datos durante el tiempo necesario para cumplir las finalidades indicadas:
            datos de compra por 6 años (obligación tributaria), datos de contacto por 2 años desde
            la última interacción.
          </p>

          <h2>7. Tus derechos</h2>
          <p>
            Bajo la Ley N° 19.628 tienes derecho a:
          </p>
          <ul>
            <li><strong>Acceso:</strong> conocer qué datos tenemos sobre ti</li>
            <li><strong>Rectificación:</strong> corregir datos inexactos</li>
            <li><strong>Cancelación:</strong> solicitar la eliminación de tus datos</li>
            <li><strong>Oposición:</strong> oponerte a ciertos tratamientos</li>
          </ul>
          <p>
            Para ejercer estos derechos, escríbenos a{" "}
            <a href={`mailto:${brandConfig.legal.privacyEmail}`}>{brandConfig.legal.privacyEmail}</a>.
            Responderemos en un plazo máximo de 15 días hábiles.
          </p>

          <h2>8. Cookies</h2>
          <p>
            Usamos cookies esenciales para el funcionamiento del sitio (carrito de compras, sesión).
            Las cookies de análisis solo se activan con tu consentimiento. Puedes gestionar las
            preferencias de cookies en la configuración de tu navegador.
          </p>

          <h2>9. Seguridad</h2>
          <p>
            Implementamos medidas técnicas y organizativas para proteger tus datos: conexiones HTTPS,
            cifrado en reposo, acceso restringido al personal autorizado, y auditorías periódicas.
            Sin embargo, ningún sistema es 100% seguro. Te notificaremos en caso de brecha de seguridad
            que afecte tus derechos según lo exige la ley.
          </p>

          <h2>10. Cambios a esta política</h2>
          <p>
            Podemos actualizar esta política en cualquier momento. La fecha de "última actualización"
            al inicio de esta página indicará cuándo se realizaron los últimos cambios.
          </p>
        </div>
      </section>
    </div>
  );
}
