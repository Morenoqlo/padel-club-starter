import type { Metadata } from "next";
import { getClasses } from "@/services/classes";
import { brandConfig } from "@/config/brand";
import { mockClasses } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/utils";
import {
  Clock,
  Users,
  Trophy,
  Zap,
  Star,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import type { Class } from "@/types";

export const metadata: Metadata = {
  title: "Clases & Academia",
  description: `Aprende pádel con los mejores instructores en ${brandConfig.name}. Niveles principiante, intermedio y avanzado.`,
};

export const revalidate = 300;

const LEVEL_CONFIG: Record<
  string,
  { label: string; color: string; icon: typeof Zap }
> = {
  beginner: {
    label: "Principiante",
    color: "accent",
    icon: Star,
  },
  intermediate: {
    label: "Intermedio",
    color: "warning",
    icon: Zap,
  },
  advanced: {
    label: "Avanzado",
    color: "destructive",
    icon: Trophy,
  },
  all: {
    label: "Todos los niveles",
    color: "secondary",
    icon: Users,
  },
};

function ClassCard({ cls }: { cls: Class }) {
  const level = LEVEL_CONFIG[cls.level] ?? LEVEL_CONFIG.all;
  const Icon = level.icon;
  const scheduleMsg = cls.schedule
    ? (cls.schedule as Array<{ day: string; time: string }>)
        .map((s) => `${s.day} ${s.time}`)
        .join(" · ")
    : "";

  return (
    <div className="group rounded-2xl border border-border bg-background overflow-hidden hover:border-accent/30 transition-all hover:shadow-lg">
      {/* Level bar */}
      <div
        className={`h-1 w-full ${
          cls.level === "beginner"
            ? "bg-accent"
            : cls.level === "intermediate"
            ? "bg-amber-500"
            : "bg-destructive"
        }`}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
            <Icon className="h-5 w-5 text-accent" />
          </div>
          <Badge
            variant={
              cls.level === "beginner"
                ? "accent"
                : cls.level === "intermediate"
                ? "warning"
                : "destructive"
            }
          >
            {level.label}
          </Badge>
        </div>

        <h3 className="font-display text-xl font-bold mb-2">{cls.name}</h3>
        <p className="text-sm text-muted-foreground mb-5">{cls.description}</p>

        {/* Meta */}
        <div className="space-y-2 mb-6">
          {cls.instructor && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Instructor:</span>
              <span className="font-medium">{cls.instructor}</span>
            </div>
          )}
          {scheduleMsg && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">{scheduleMsg}</span>
            </div>
          )}
          {cls.duration_minutes && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {cls.duration_minutes} minutos por sesión
              </span>
            </div>
          )}
          {cls.max_students && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">
                Máx. {cls.max_students} alumnos
              </span>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="rounded-xl bg-secondary/50 p-4 mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Por sesión</p>
            <p className="font-display text-xl font-bold text-accent">
              {cls.price_per_session ? formatPrice(cls.price_per_session) : "Consultar"}
            </p>
          </div>
          {cls.price_monthly && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Mensual</p>
              <p className="font-display text-xl font-bold">
                {formatPrice(cls.price_monthly)}
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <a
          href={whatsappUrl(
            brandConfig.contact.whatsapp,
            `Hola, me interesa la clase: ${cls.name}`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-semibold text-background hover:bg-foreground/90 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          Consultar disponibilidad
        </a>
      </div>
    </div>
  );
}

export default async function ClasesPage() {
  const classes = await getClasses().catch(() => mockClasses);

  const featured = classes.filter((c) => c.is_featured);
  const rest = classes.filter((c) => !c.is_featured);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="section-sm border-b border-border bg-secondary/30">
        <div className="container">
          <p className="label-overline mb-3">Academia</p>
          <h1 className="heading-xl">Clases & Formación</h1>
          <p className="mt-4 body-lg max-w-xl">
            Desde cero hasta la competencia. Nuestros instructores certificados
            te llevan al siguiente nivel.
          </p>
        </div>
      </section>

      {/* Benefits strip */}
      <section className="border-b border-border py-6">
        <div className="container">
          <div className="flex flex-wrap gap-6 md:gap-10">
            {[
              "Instructores certificados",
              "Grupos reducidos",
              "Canchas exclusivas",
              "Metodología progresiva",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Classes grid */}
      <section className="section">
        <div className="container">
          {classes.length === 0 ? (
            <div className="py-24 text-center text-muted-foreground">
              No hay clases disponibles actualmente.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {classes.map((cls) => (
                <ClassCard key={cls.id} cls={cls} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Custom training CTA */}
      <section className="section border-t border-border bg-foreground text-background">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <p className="label-overline mb-4">Entrenamiento a medida</p>
            <h2 className="heading-lg text-background mb-4">
              ¿Buscas clases privadas?
            </h2>
            <p className="text-background/60 mb-8">
              Diseñamos un programa 100% personalizado adaptado a tus objetivos,
              horarios y nivel. Para jugadores que quieren resultados rápidos.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href={whatsappUrl(
                  brandConfig.contact.whatsapp,
                  "Hola, me interesan clases privadas de pádel."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Consultar clase privada
              </a>
              <a
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-full border border-background/20 px-7 py-3 text-sm font-semibold text-background hover:bg-background/10 transition-colors"
              >
                Enviar formulario
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
