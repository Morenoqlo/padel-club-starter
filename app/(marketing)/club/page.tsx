import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { brandConfig } from "@/config/brand";
import {
  MapPin, Clock, Phone, Mail, Wifi, Car, ShowerHead,
  Coffee, Package, Lock, CheckCircle2, ArrowRight,
} from "lucide-react";
import { whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "El Club",
  description: `Conoce ${brandConfig.name} — instalaciones premium de ${brandConfig.sport.name} en ${brandConfig.location.city}.`,
};

const FACILITIES = [
  { icon: Wifi, label: "WiFi gratuito" },
  { icon: Car, label: `Estacionamiento ${brandConfig.facilities.hasParking ? "gratuito" : "disponible"}` },
  { icon: ShowerHead, label: "Duchas y camarines" },
  { icon: Coffee, label: "Café y nutrición" },
  { icon: Package, label: "Pro Shop oficial" },
  { icon: Lock, label: "Casilleros seguros" },
];

const STATS = [
  { value: String(brandConfig.facilities.totalCourts), label: "Canchas profesionales" },
  { value: "+2.000", label: "Jugadores activos" },
  { value: "5★", label: "Valoración Google" },
  { value: "7/7", label: "Días disponible" },
];

const TEAM = [
  {
    name: "Carlos Mendoza",
    role: "Director Técnico",
    bio: "Ex jugador profesional con 15 años de experiencia. Formado en la Academia Nacional de Pádel.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&q=80&auto=format&fit=crop&crop=face",
  },
  {
    name: "María González",
    role: "Head Coach — Academia",
    bio: "Instructora certificada nivel 3. Especialista en formación infantil y principiantes.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&q=80&auto=format&fit=crop&crop=face",
  },
  {
    name: "Diego Fernández",
    role: "Coach Alto Rendimiento",
    bio: "Preparador físico y técnico para jugadores competitivos. +200 torneos disputados.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&q=80&auto=format&fit=crop&crop=face",
  },
];

export default function ClubPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground py-24 md:py-36">
        <div className="absolute inset-0 grid-dot-pattern opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
        <div className="container relative">
          <div className="max-w-3xl">
            <p className="label-overline mb-6 text-accent">Nuestro club</p>
            <h1 className="heading-hero text-background text-balance">
              Más que un club,<br />
              <span className="text-accent">una comunidad.</span>
            </h1>
            <p className="mt-8 text-lg text-background/60 max-w-xl leading-relaxed">
              {brandConfig.name} nació de la pasión por el {brandConfig.sport.name.toLowerCase()}.
              Creamos un espacio donde cada jugador — desde principiante hasta competidor —
              encuentra su lugar.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={brandConfig.booking.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
              >
                {brandConfig.booking.ctaText}
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/clases"
                className="inline-flex items-center gap-2 rounded-full border border-background/20 px-7 py-3 text-sm font-semibold text-background hover:bg-background/10 transition-colors"
              >
                Ver clases
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-secondary/30 py-8">
        <div className="container">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-4xl font-bold text-accent">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courts */}
      <section className="section" id="instalaciones">
        <div className="container">
          <div className="mb-12">
            <p className="label-overline mb-3">Instalaciones</p>
            <h2 className="heading-lg max-w-xl">
              {brandConfig.facilities.totalCourts} canchas diseñadas para el alto rendimiento.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Indoor */}
            <div className="group relative overflow-hidden rounded-3xl bg-foreground">
              <div className="relative h-64">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80&auto=format&fit=crop"
                  alt="Canchas Indoor"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/30 to-transparent" />
              </div>
              <div className="p-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="label-overline text-accent">INDOOR</span>
                  <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent">
                    {brandConfig.facilities.indoorCourts} canchas
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-background mb-3">
                  Canchas Techadas
                </h3>
                <p className="text-background/60 text-sm leading-relaxed mb-5">
                  Temperatura controlada todo el año. Iluminación LED profesional de competición.
                  Cristal panorámico y malla de acero inoxidable.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Temperatura controlada", "LED profesional", "Cristal panorámico", "Sonorización"].map((f) => (
                    <span key={f} className="flex items-center gap-1.5 text-xs text-background/50">
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Outdoor */}
            <div className="group relative overflow-hidden rounded-3xl bg-foreground">
              <div className="relative h-64">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1611457194403-d3aca4cf9d11?w=800&q=80&auto=format&fit=crop"
                  alt="Canchas Outdoor"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/30 to-transparent" />
              </div>
              <div className="p-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="label-overline text-accent">OUTDOOR</span>
                  <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent">
                    {brandConfig.facilities.outdoorCourts} canchas
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-background mb-3">
                  Canchas al Aire Libre
                </h3>
                <p className="text-background/60 text-sm leading-relaxed mb-5">
                  Vistas panorámicas al entorno natural. Césped artificial WPT de última generación.
                  Iluminación nocturna para jugar hasta tarde.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Césped WPT", "Iluminación nocturna", "Drenaje perfecto", "Zona de espera"].map((f) => (
                    <span key={f} className="flex items-center gap-1.5 text-xs text-background/50">
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="section border-t border-border bg-secondary/30">
        <div className="container">
          <div className="mb-12">
            <p className="label-overline mb-3">Servicios</p>
            <h2 className="heading-lg">Todo lo que necesitas, en un solo lugar.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FACILITIES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-4 rounded-2xl bg-background p-5 border border-border">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section border-t border-border" id="equipo">
        <div className="container">
          <div className="mb-12">
            <p className="label-overline mb-3">Nuestro equipo</p>
            <h2 className="heading-lg">Los mejores entrenadores de la región.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((member) => (
              <div key={member.name} className="group rounded-2xl border border-border bg-background overflow-hidden hover:border-accent/30 transition-colors">
                <div className="relative h-52 overflow-hidden bg-secondary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.image}
                    alt={member.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="label-overline mb-1 text-accent">{member.role}</p>
                  <h3 className="font-display text-lg font-bold mb-2">{member.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section border-t border-border bg-secondary/30">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="label-overline mb-4">Cómo llegar</p>
              <h2 className="heading-lg mb-6">Estamos en el corazón de {brandConfig.location.commune}.</h2>

              <div className="space-y-5 mb-8">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5">Dirección</p>
                    <p className="text-sm text-muted-foreground">
                      {brandConfig.location.address}, {brandConfig.location.commune},{" "}
                      {brandConfig.location.city}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5">Horarios</p>
                    <p className="text-sm text-muted-foreground">
                      Lun–Vie: {brandConfig.hours.weekdays}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sáb–Dom: {brandConfig.hours.weekends}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5">Contacto</p>
                    <p className="text-sm text-muted-foreground">{brandConfig.contact.phone}</p>
                    <p className="text-sm text-muted-foreground">{brandConfig.contact.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={brandConfig.location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background hover:bg-foreground/90 transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  Abrir en Google Maps
                </a>
                <a
                  href={whatsappUrl(brandConfig.contact.whatsapp, "Hola, quiero visitar el club.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors"
                >
                  Contactar por WhatsApp
                </a>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-secondary border border-border">
              <Image
                src={`https://placehold.co/800x600/F5F5F5/737373?text=${encodeURIComponent(brandConfig.location.address)}`}
                alt="Mapa de ubicación"
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <a
                  href={brandConfig.location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-2xl bg-background/95 backdrop-blur px-5 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow border border-border"
                >
                  <MapPin className="h-4 w-4 text-accent" />
                  Ver en Google Maps
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
