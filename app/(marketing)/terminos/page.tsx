import type { Metadata } from "next";
import { brandConfig } from "@/config/brand";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: `Términos y condiciones de uso de ${brandConfig.name}`,
};

export default function TerminosPage() {
  const updated = "18 de abril de 2025";

  return (
    <div className="pt-20">
      <section className="section-sm border-b border-border bg-secondary/30">
        <div className="container max-w-3xl">
          <p className="label-overline mb-3">Legal</p>
          <h1 className="heading-xl">Términos y Condiciones</h1>
          <p className="mt-3 text-sm text-muted-foreground">Última actualización: {updated}</p>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-3xl prose prose-sm dark:prose-invert">

          <h2>1. Aceptación de los términos</h2>
          <p>
            Al acceder y utilizar el sitio web de <strong>{brandConfig.name}</strong> ({brandConfig.legal.companyName},
            RUT {brandConfig.legal.rut}), aceptas quedar vinculado por estos Términos y Condiciones.
            Si no estás de acuerdo con alguno de ellos, por favor abstente de usar nuestros servicios.
          </p>

          <h2>2. Servicios ofrecidos</h2>
          <p>
            {brandConfig.name} ofrece los siguientes servicios a través de este sitio:
          </p>
          <ul>
            <li>Información sobre instalaciones y canchas de {brandConfig.sport.name}</li>
            <li>Reserva de canchas (a través de plataforma externa)</li>
            <li>Inscripción y consulta de clases y torneos</li>
            <li>Compra de productos en nuestra tienda oficial</li>
            <li>Consultas a través del formulario de contacto</li>
          </ul>

          <h2>3. Compras y pagos</h2>
          <p>
            Todos los precios en nuestra tienda están expresados en Pesos Chilenos (CLP) e incluyen IVA.
            Las compras se procesan a través de proveedores de pago seguros (Stripe, MercadoPago o Transbank).
            {brandConfig.name} no almacena datos de tarjetas de crédito o débito.
          </p>
          <p>
            Las órdenes se consideran confirmadas una vez que el pago ha sido procesado exitosamente.
            Recibirás una confirmación por email al completar tu compra.
          </p>

          <h2>4. Política de devoluciones</h2>
          <p>
            Los productos en buen estado pueden ser devueltos dentro de los <strong>10 días corridos</strong> desde
            la fecha de entrega, siempre que estén sin uso, con sus etiquetas originales y en su empaque original.
            Para iniciar una devolución, contáctanos a {brandConfig.contact.email}.
          </p>
          <p>
            Los servicios (clases, torneos) no son reembolsables una vez iniciados. En caso de cancelación
            con más de 48 horas de anticipación, se ofrecerá crédito para futura sesión.
          </p>

          <h2>5. Reserva de canchas</h2>
          <p>
            Las reservas se gestionan a través de nuestra plataforma de reservas externa ({brandConfig.booking.provider}).
            Las cancelaciones deben realizarse con al menos <strong>2 horas de anticipación</strong> para no incurrir
            en cargo. {brandConfig.name} se reserva el derecho de cancelar reservas por condiciones climáticas o
            mantenimiento, ofreciendo reubicación sin costo.
          </p>

          <h2>6. Código de conducta</h2>
          <p>
            Los usuarios del club se comprometen a:
          </p>
          <ul>
            <li>Respetar a los demás jugadores, coaches e instalaciones</li>
            <li>Usar el equipamiento de protección adecuado</li>
            <li>No ingresar bajo los efectos de alcohol o sustancias</li>
            <li>Respetar los horarios reservados</li>
          </ul>
          <p>
            El incumplimiento puede resultar en la suspensión temporal o permanente del acceso al club.
          </p>

          <h2>7. Propiedad intelectual</h2>
          <p>
            Todo el contenido de este sitio (textos, imágenes, logos, diseño) es propiedad de{" "}
            {brandConfig.legal.companyName} y está protegido por las leyes de propiedad intelectual.
            Queda prohibida su reproducción sin autorización escrita.
          </p>

          <h2>8. Limitación de responsabilidad</h2>
          <p>
            {brandConfig.name} no se hace responsable por lesiones derivadas del uso de instalaciones fuera
            de los protocolos de seguridad establecidos. La práctica de actividades deportivas conlleva
            riesgos inherentes que el usuario acepta al participar.
          </p>

          <h2>9. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios
            serán publicados en esta página con la fecha de actualización. El uso continuado del sitio
            tras las modificaciones implica aceptación de los nuevos términos.
          </p>

          <h2>10. Contacto</h2>
          <p>
            Para cualquier consulta sobre estos términos, contáctanos en:{" "}
            <a href={`mailto:${brandConfig.legal.privacyEmail}`}>{brandConfig.legal.privacyEmail}</a>
          </p>
        </div>
      </section>
    </div>
  );
}
