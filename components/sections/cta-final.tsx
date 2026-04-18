"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, MessageCircle } from "lucide-react";
import { brandConfig } from "@/config/brand";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CTAFinalProps {
  className?: string;
}

export function CTAFinalSection({ className }: CTAFinalProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section
      className={cn("section bg-accent overflow-hidden relative", className)}
      ref={ref}
    >
      {/* Decorative elements */}
      <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
        <div className="absolute right-20 top-10 font-display text-[20rem] font-black leading-none text-white select-none">
          {brandConfig.sport.icon}
        </div>
      </div>

      <div className="container relative z-10">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-4"
          >
            ¿Listo para jugar?
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="heading-xl text-white text-balance"
          >
            Reserva tu cancha hoy.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-white/70 max-w-lg"
          >
            Disponibilidad en tiempo real. Sin llamadas. Sin complicaciones.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-accent hover:bg-white/90 text-base font-semibold px-8 h-12"
            >
              <a
                href={brandConfig.booking.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {brandConfig.booking.ctaText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 text-base font-semibold px-8 h-12"
            >
              <a
                href={whatsappUrl(
                  brandConfig.contact.whatsapp,
                  brandConfig.contact.whatsappMessage
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
