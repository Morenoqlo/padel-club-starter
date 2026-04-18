import type { Metadata } from "next";
import { ExternalLink, Calendar, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brandConfig } from "@/config/brand";

export const metadata: Metadata = {
  title: "Reservar Cancha",
  description: `Reserva tu cancha de ${brandConfig.sport.name} en ${brandConfig.name}`,
};

export default function ReservasPage() {
  return (
    <div className="pt-20">
      <section className="section-sm border-b border-border bg-secondary/30">
        <div className="container">
          <p className="label-overline mb-3">Disponibilidad en tiempo real</p>
          <h1 className="heading-xl">Reserva tu cancha</h1>
          <p className="mt-4 body-lg max-w-xl">
            Sistema de reservas online 24/7. Elige tu cancha, horario y paga de forma segura en segundos.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3 mb-16">
            {[
              {
                icon: Calendar,
                step: "01",
                title: "Elige fecha y hora",
                desc: "Consulta disponibilidad en tiempo real para el día y horario que prefieras.",
              },
              {
                icon: Clock,
                step: "02",
                title: "Selecciona tu cancha",
                desc: "Elige entre nuestras canchas indoor y outdoor según tu preferencia.",
              },
              {
                icon: Phone,
                step: "03",
                title: "Confirma y paga",
                desc: "Pago seguro online. Recibes confirmación instantánea por WhatsApp y email.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative">
                  <span className="font-display text-6xl font-black text-border absolute -top-2 right-0">
                    {item.step}
                  </span>
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* CTA principal */}
          <div className="rounded-3xl bg-foreground p-10 text-center text-background">
            <p className="label-overline mb-3 text-accent">Reserva ahora</p>
            <h2 className="heading-lg text-background mb-4">
              Sistema de reservas {brandConfig.booking.provider}
            </h2>
            <p className="text-background/60 mb-8 max-w-md mx-auto">
              Serás redirigido a nuestro sistema de reservas oficial donde podrás ver disponibilidad en tiempo real.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white h-12 px-10 text-base font-semibold"
            >
              <a
                href={brandConfig.booking.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {brandConfig.booking.ctaText}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <p className="mt-4 text-xs text-background/40">
              Abre {brandConfig.booking.provider} en una nueva pestaña
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
