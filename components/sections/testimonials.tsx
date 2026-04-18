"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star } from "lucide-react";
import type { Testimonial } from "@/types";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

interface TestimonialsProps {
  testimonials: Testimonial[];
  className?: string;
}

export function TestimonialsSection({ testimonials, className }: TestimonialsProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className={cn("section bg-foreground text-background overflow-hidden", className)} ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <p className="label-overline mb-3 text-accent">Testimonios</p>
          <h2 className="heading-xl text-background">
            Lo dicen nuestros
            <br />
            <span className="text-background/40">jugadores.</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-background/5 p-6 border border-background/10"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-sm leading-relaxed text-background/70 mb-6">
                "{t.content}"
              </p>

              <div className="flex items-center gap-3">
                {t.author_image ? (
                  <img
                    src={t.author_image}
                    alt={t.author_name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-accent text-xs font-bold">
                    {getInitials(t.author_name)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-background">{t.author_name}</p>
                  {t.author_role && (
                    <p className="text-xs text-background/40">{t.author_role}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
