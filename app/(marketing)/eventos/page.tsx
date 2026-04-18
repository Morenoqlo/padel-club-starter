import type { Metadata } from "next";
import { getEvents } from "@/services/events";
import { EventCard } from "@/components/shared/event-card";
import { brandConfig } from "@/config/brand";
import { mockEvents } from "@/lib/mock-data";
import { Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Torneos & Eventos",
  description: `Próximos torneos, clínicas y eventos sociales en ${brandConfig.name}.`,
};

export const revalidate = 300;

const CATEGORIES = [
  { value: "all", label: "Todos" },
  { value: "tournament", label: "Torneos" },
  { value: "clinic", label: "Clínicas" },
  { value: "social", label: "Sociales" },
  { value: "league", label: "Ligas" },
];

export default async function EventosPage() {
  const events = await getEvents({ upcoming: true }).catch(() => mockEvents);

  const upcoming = events.filter(
    (e) => new Date(e.event_date) >= new Date()
  );
  const past = events.filter(
    (e) => new Date(e.event_date) < new Date()
  );

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="section-sm border-b border-border bg-secondary/30">
        <div className="container">
          <p className="label-overline mb-3">Calendario</p>
          <h1 className="heading-xl">Torneos & Eventos</h1>
          <p className="mt-4 body-lg max-w-xl">
            Compite, aprende y conecta. Revisa todos los próximos eventos del
            club y asegura tu lugar.
          </p>
        </div>
      </section>

      {/* Upcoming */}
      <section className="section">
        <div className="container">
          <div className="flex items-center gap-3 mb-10">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Calendar className="h-4 w-4" />
            </div>
            <h2 className="heading-md">Próximos eventos</h2>
          </div>

          {upcoming.length === 0 ? (
            <div className="py-24 text-center rounded-2xl border border-border border-dashed">
              <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No hay eventos próximos programados.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Síguenos en redes sociales para no perderte ninguno.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past events */}
      {past.length > 0 && (
        <section className="section border-t border-border bg-secondary/30">
          <div className="container">
            <h2 className="heading-md mb-10 text-muted-foreground">
              Eventos pasados
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section border-t border-border">
        <div className="container">
          <div className="rounded-2xl bg-foreground p-8 md:p-12 text-center max-w-2xl mx-auto">
            <p className="label-overline mb-4 text-accent">¿Quieres organizar?</p>
            <h3 className="font-display text-2xl font-bold text-background mb-3">
              Organiza tu evento en {brandConfig.name}
            </h3>
            <p className="text-background/60 mb-6">
              Disponemos de espacios para torneos privados, eventos corporativos
              y fiestas de cumpleaños.
            </p>
            <a
              href={`mailto:${brandConfig.contact.email}?subject=Consulta organización evento`}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
            >
              Contactar para eventos
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
