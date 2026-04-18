import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { brandConfig } from "@/config/brand";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Contáctanos — ${brandConfig.name}`,
};

export default function ContactoPage() {
  return (
    <div className="pt-20">
      <section className="section-sm border-b border-border bg-secondary/30">
        <div className="container">
          <p className="label-overline mb-3">Contacto</p>
          <h1 className="heading-xl">Hablemos.</h1>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-16 lg:grid-cols-2">
          {/* Info */}
          <div className="space-y-10">
            <div className="space-y-6">
              {[
                {
                  icon: MapPin,
                  label: "Dirección",
                  value: `${brandConfig.location.address}, ${brandConfig.location.commune}, ${brandConfig.location.city}`,
                  href: brandConfig.location.mapUrl,
                },
                {
                  icon: Phone,
                  label: "Teléfono",
                  value: brandConfig.contact.phone,
                  href: `tel:${brandConfig.contact.phone}`,
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: brandConfig.contact.email,
                  href: `mailto:${brandConfig.contact.email}`,
                },
                {
                  icon: Clock,
                  label: "Horarios",
                  value: `Lun–Vie ${brandConfig.hours.weekdays} · Sáb–Dom ${brandConfig.hours.weekends}`,
                  href: null,
                },
              ].map((item) => {
                const Icon = item.icon;
                const content = (
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                      <p className="font-medium text-sm">{item.value}</p>
                    </div>
                  </div>
                );

                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="block hover:opacity-80 transition-opacity"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={item.label}>{content}</div>
                );
              })}
            </div>

            {/* WhatsApp CTA */}
            <a
              href={whatsappUrl(
                brandConfig.contact.whatsapp,
                brandConfig.contact.whatsappMessage
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-[#25D366] p-5 text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-6 w-6 shrink-0" />
              <div>
                <p className="font-semibold">Escríbenos por WhatsApp</p>
                <p className="text-sm text-white/70">Respuesta en minutos</p>
              </div>
            </a>
          </div>

          {/* Form */}
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
