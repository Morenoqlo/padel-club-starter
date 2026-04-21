"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { brandConfig } from "@/config/brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const courtTypes = [
  {
    id: "indoor",
    label: "Indoor",
    count: brandConfig.facilities.indoorCourts,
    description:
      "Canchas cubiertas con temperatura controlada. Juega sin importar el clima, con iluminación profesional de competición.",
    features: ["Cristal panorámico", "Climatización", "Iluminación LED", "Sonorización"],
    image: "https://mcmeoameblplqqdiawjn.supabase.co/storage/v1/object/public/Fotos/Indoor.jpeg",
    accent: true,
  },
  {
    id: "outdoor",
    label: "Outdoor",
    count: brandConfig.facilities.outdoorCourts,
    description:
      "Canchas al aire libre con vistas panorámicas. Césped artificial de última generación y malla perimetral profesional.",
    features: ["Pared de cristal", "Drenaje perfecto", "Iluminación nocturna", "Zona de espera"],
    image: "https://mcmeoameblplqqdiawjn.supabase.co/storage/v1/object/public/Fotos/Outdoor.jpg",
    accent: false,
  },
];

interface CourtsProps {
  className?: string;
}

export function CourtsSection({ className }: CourtsProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className={cn("section bg-secondary/30", className)} ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="label-overline mb-3">Instalaciones</p>
            <h2 className="heading-xl">
              {brandConfig.facilities.totalCourts} canchas
              <br />
              <span className="text-muted-foreground">de primer nivel.</span>
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/reservas">
              Ver disponibilidad
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {courtTypes.map((court, i) => (
            <motion.div
              key={court.id}
              initial={{ opacity: 0, x: i === 0 ? -24 : 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15 }}
              className={cn(
                "group relative overflow-hidden rounded-3xl",
                court.accent ? "bg-foreground text-background" : "bg-background border border-border"
              )}
            >
              {/* Image */}
              <div className="h-56 overflow-hidden">
                <img
                  src={court.image}
                  alt={`Canchas ${court.label}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className={cn(
                    "label-overline",
                    court.accent ? "text-accent" : "text-accent"
                  )}>
                    {court.label}
                  </span>
                  <span className={cn(
                    "font-display text-4xl font-bold",
                    court.accent ? "text-background/20" : "text-foreground/10"
                  )}>
                    {court.count}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold mb-3">
                  {court.count} Canchas {court.label}
                </h3>
                <p className={cn(
                  "text-sm leading-relaxed mb-6",
                  court.accent ? "text-background/60" : "text-muted-foreground"
                )}>
                  {court.description}
                </p>

                <ul className="flex flex-wrap gap-2">
                  {court.features.map((feature) => (
                    <li
                      key={feature}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium",
                        court.accent
                          ? "bg-background/10 text-background/70"
                          : "bg-secondary text-foreground/70"
                      )}
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
