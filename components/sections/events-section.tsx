"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/shared/event-card";
import type { Event } from "@/types";
import { cn } from "@/lib/utils";

interface EventsSectionProps {
  events: Event[];
  className?: string;
}

export function EventsSection({ events, className }: EventsSectionProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className={cn("section bg-background", className)} ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <p className="label-overline mb-3">Próximos eventos</p>
            <h2 className="heading-xl">
              Torneos y
              <br />
              <span className="text-muted-foreground">actividades.</span>
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/eventos">
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <Calendar className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">
              No hay eventos próximos. ¡Vuelve pronto!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
