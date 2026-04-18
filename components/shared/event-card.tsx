import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import type { Event } from "@/types";
import { formatDate, formatPrice, cn } from "@/lib/utils";

const categoryLabels: Record<string, string> = {
  tournament: "Torneo",
  social: "Social",
  workshop: "Taller",
  clinic: "Clínica",
  other: "Evento",
};

const categoryColors: Record<string, string> = {
  tournament: "bg-amber-100 text-amber-700",
  social: "bg-blue-100 text-blue-700",
  workshop: "bg-purple-100 text-purple-700",
  clinic: "bg-green-100 text-green-700",
  other: "bg-gray-100 text-gray-700",
};

interface EventCardProps {
  event: Event;
  className?: string;
}

export function EventCard({ event, className }: EventCardProps) {
  const spotsLeft =
    event.max_participants != null && event.current_participants != null
      ? event.max_participants - event.current_participants
      : null;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-secondary">
        {event.image_url && (
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        {/* Category badge */}
        <span
          className={cn(
            "absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold",
            categoryColors[event.category] ?? categoryColors.other
          )}
        >
          {categoryLabels[event.category] ?? "Evento"}
        </span>

        {/* Spots */}
        {spotsLeft !== null && spotsLeft <= 5 && spotsLeft > 0 && (
          <span className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
            ¡Últimos {spotsLeft}!
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <h3 className="font-display text-lg font-semibold leading-tight mb-2 group-hover:text-accent transition-colors">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {event.description}
            </p>
          )}
        </div>

        {/* Meta */}
        <div className="space-y-2 border-t border-border pt-4 mt-auto">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{formatDate(event.event_date, { weekday: "long", day: "numeric", month: "long" })}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
          {event.max_participants && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5 shrink-0" />
              <span>
                {event.current_participants ?? 0}/{event.max_participants} participantes
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-3">
          <span className="font-display text-lg font-bold">
            {event.price ? formatPrice(event.price) : "Gratis"}
          </span>
          {event.registration_url ? (
            <a
              href={event.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              Inscribirse <ArrowRight className="h-3.5 w-3.5" />
            </a>
          ) : (
            <Link
              href={`/eventos/${event.slug}`}
              className="flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              Ver más <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
