"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Zap, Shield, Users, Trophy, Clock, Star } from "lucide-react";
import { brandConfig } from "@/config/brand";
import { cn } from "@/lib/utils";

const benefits = [
  {
    icon: Zap,
    title: "Reserva instantánea",
    description: "Reserva tu cancha en menos de 30 segundos desde cualquier dispositivo, sin llamadas ni esperas.",
  },
  {
    icon: Shield,
    title: "Instalaciones premium",
    description: "Canchas profesionales con mantenimiento diario, iluminación LED y césped artificial de última generación.",
  },
  {
    icon: Users,
    title: "Comunidad activa",
    description: "Más de 2.000 jugadores en nuestra red. Encuentra pareja de juego, únete a torneos y conecta.",
  },
  {
    icon: Trophy,
    title: "Torneos todo el año",
    description: "Calendario de competencias para todos los niveles. Desde principiantes hasta categoría A.",
  },
  {
    icon: Clock,
    title: "Horarios flexibles",
    description: `Abiertos ${brandConfig.hours.weekdays} de lunes a viernes y ${brandConfig.hours.weekends} los fines de semana.`,
  },
  {
    icon: Star,
    title: "Academia oficial",
    description: "Instructores certificados para todos los niveles. Mejora tu técnica con metodología progresiva.",
  },
];

interface BenefitsProps {
  className?: string;
}

export function BenefitsSection({ className }: BenefitsProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className={cn("section bg-background", className)} ref={ref}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="label-overline mb-3">Por qué elegirnos</p>
          <h2 className="heading-xl">
            Todo lo que necesitas
            <br />
            <span className="text-muted-foreground">en un solo club.</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group rounded-2xl border border-border p-6 transition-all duration-300 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
