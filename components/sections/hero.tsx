"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { brandConfig } from "@/config/brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroProps {
  className?: string;
}

export function HeroSection({ className }: HeroProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-screen items-end overflow-hidden bg-foreground pb-20 pt-32 md:pb-28 md:pt-36",
        className
      )}
    >
      {/* Background — replace with real image via Next/Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://mcmeoameblplqqdiawjn.supabase.co/storage/v1/object/public/Fotos/hero/hero.jpg')",
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/80 to-foreground/20" />

      {/* Decorative grid */}
      <div className="absolute inset-0 grid-dot-pattern opacity-5" />

      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-4xl">
          {/* Overline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="label-overline mb-6 text-accent"
          >
            {brandConfig.location.city} · {brandConfig.facilities.totalCourts} canchas disponibles
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="heading-hero text-background text-balance"
          >
            Tu cancha
            <br />
            <span className="text-accent">te espera.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-lg text-background/60 max-w-xl md:text-xl"
          >
            Reserva en segundos, juega con los mejores.
            El club de {brandConfig.sport.name.toLowerCase()} más moderno de {brandConfig.location.city}.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white text-base font-semibold px-8 h-12"
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
              className="border-background/30 bg-transparent text-background hover:bg-background/10 text-base font-semibold px-8 h-12"
            >
              <Link href="/eventos">
                <Calendar className="mr-2 h-4 w-4" />
                Ver torneos
              </Link>
            </Button>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 flex flex-wrap gap-8 border-t border-background/10 pt-8"
          >
            {[
              { value: `${brandConfig.facilities.totalCourts}`, label: "Canchas" },
              { value: "5★", label: "Valoración media" },
              { value: "+2.000", label: "Jugadores activos" },
              { value: "7/7", label: "Días disponible" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl font-bold text-background">
                  {stat.value}
                </p>
                <p className="text-sm text-background/50">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
