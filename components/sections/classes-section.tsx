"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { ArrowRight, Users, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Class } from "@/types";
import { formatPrice, cn } from "@/lib/utils";

const levelLabels: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
  all: "Todos los niveles",
};

const levelColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-blue-100 text-blue-700",
  advanced: "bg-red-100 text-red-700",
  all: "bg-purple-100 text-purple-700",
};

interface ClassesSectionProps {
  classes: Class[];
  className?: string;
}

export function ClassesSection({ classes, className }: ClassesSectionProps) {
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
            <p className="label-overline mb-3">Academia</p>
            <h2 className="heading-xl">
              Aprende con
              <br />
              <span className="text-muted-foreground">los mejores.</span>
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/clases">
              Ver todas las clases
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="space-y-4">
          {classes.map((cls, i) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/clases#${cls.slug}`}
                className="group flex flex-col gap-4 rounded-2xl border border-border p-6 transition-all hover:border-accent/40 hover:shadow-md md:flex-row md:items-center"
              >
                {/* Level badge */}
                <span
                  className={cn(
                    "inline-flex self-start rounded-full px-3 py-1 text-xs font-semibold md:self-auto",
                    levelColors[cls.level] ?? levelColors.all
                  )}
                >
                  {levelLabels[cls.level] ?? "Todos"}
                </span>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold group-hover:text-accent transition-colors">
                    {cls.name}
                  </h3>
                  {cls.instructor && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Instructor: {cls.instructor}
                    </p>
                  )}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{cls.duration_minutes} min</span>
                  </div>
                  {cls.max_students && (
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span>Máx. {cls.max_students}</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  {cls.price_monthly && (
                    <p className="font-display text-lg font-bold">
                      {formatPrice(cls.price_monthly)}
                      <span className="text-xs font-normal text-muted-foreground">/mes</span>
                    </p>
                  )}
                  {cls.price_per_session && (
                    <p className="text-xs text-muted-foreground">
                      o {formatPrice(cls.price_per_session)}/sesión
                    </p>
                  )}
                </div>

                <ChevronRight className="h-5 w-5 text-muted-foreground/40 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
