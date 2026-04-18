import { brandConfig } from "@/config/brand";
import {
  Globe, MapPin, Phone, Mail, Clock, Instagram, Facebook,
  CreditCard, Calendar, CheckCircle2, Info,
} from "lucide-react";

function ConfigSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      <div className="border-b border-border px-5 py-4">
        <h2 className="font-semibold text-sm">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function ConfigRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground mt-0.5">
          <Icon className="h-3.5 w-3.5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-medium truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function AdminConfiguracionPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-1">Configuración</h1>
        <p className="text-sm text-muted-foreground">
          Configuración actual del club. Para editar, modifica{" "}
          <code className="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono">
            config/brand.ts
          </code>
        </p>
      </div>

      {/* Dev notice */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
        <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            Configuración centralizada
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
            Todos los datos se gestionan en{" "}
            <code className="font-mono">config/brand.ts</code>. En una
            versión completa esto se conecta a Supabase y edita en tiempo real.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Identity */}
        <ConfigSection title="Identidad del club">
          <ConfigRow label="Nombre" value={brandConfig.name} icon={Globe} />
          <ConfigRow label="Abreviación" value={brandConfig.shortName} icon={Globe} />
          <ConfigRow label="Tagline" value={brandConfig.tagline} icon={Globe} />
          <ConfigRow label="Deporte" value={brandConfig.sport.name} icon={Globe} />
        </ConfigSection>

        {/* Contact */}
        <ConfigSection title="Contacto">
          <ConfigRow label="Email" value={brandConfig.contact.email} icon={Mail} />
          <ConfigRow label="Teléfono" value={brandConfig.contact.phone} icon={Phone} />
          <ConfigRow label="WhatsApp" value={brandConfig.contact.whatsapp} icon={Phone} />
        </ConfigSection>

        {/* Location */}
        <ConfigSection title="Ubicación">
          <ConfigRow label="Dirección" value={brandConfig.location.address} icon={MapPin} />
          <ConfigRow label="Comuna" value={brandConfig.location.commune} icon={MapPin} />
          <ConfigRow label="Ciudad" value={brandConfig.location.city} icon={MapPin} />
          <ConfigRow label="País" value={brandConfig.location.country} icon={MapPin} />
        </ConfigSection>

        {/* Hours */}
        <ConfigSection title="Horarios">
          <ConfigRow label="Lunes–Viernes" value={brandConfig.hours.weekdays} icon={Clock} />
          <ConfigRow label="Sábado–Domingo" value={brandConfig.hours.weekends} icon={Clock} />
          <ConfigRow label="Festivos" value={brandConfig.hours.holidays} icon={Clock} />
        </ConfigSection>

        {/* Social */}
        <ConfigSection title="Redes sociales">
          <ConfigRow label="Instagram" value={brandConfig.social.instagram} icon={Instagram} />
          <ConfigRow label="Facebook" value={brandConfig.social.facebook} icon={Facebook} />
          <ConfigRow label="TikTok" value={brandConfig.social.tiktok} icon={Globe} />
        </ConfigSection>

        {/* Booking */}
        <ConfigSection title="Sistema de reservas">
          <ConfigRow label="Proveedor" value={brandConfig.booking.provider} icon={Calendar} />
          <ConfigRow label="URL externa" value={brandConfig.booking.externalUrl} icon={Globe} />
          <ConfigRow label="Texto CTA" value={brandConfig.booking.ctaText} icon={Globe} />
        </ConfigSection>

        {/* Facilities */}
        <ConfigSection title="Instalaciones">
          <ConfigRow label="Total canchas" value={String(brandConfig.facilities.totalCourts)} icon={Globe} />
          <ConfigRow label="Canchas indoor" value={String(brandConfig.facilities.indoorCourts)} icon={Globe} />
          <ConfigRow label="Canchas outdoor" value={String(brandConfig.facilities.outdoorCourts)} icon={Globe} />
          <div className="grid grid-cols-2 gap-2 mt-2">
            {[
              { label: "Estacionamiento", value: brandConfig.facilities.hasParking },
              { label: "Duchas", value: brandConfig.facilities.hasShowers },
              { label: "Cafetería", value: brandConfig.facilities.hasCafe },
              { label: "Pro Shop", value: brandConfig.facilities.hasProShop },
              { label: "Casilleros", value: brandConfig.facilities.hasLockers },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <CheckCircle2
                  className={`h-4 w-4 shrink-0 ${
                    item.value ? "text-accent" : "text-muted-foreground/30"
                  }`}
                />
                <span className="text-xs">{item.label}</span>
              </div>
            ))}
          </div>
        </ConfigSection>

        {/* Sections visibility */}
        <ConfigSection title="Secciones visibles (home)">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(brandConfig.sections).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    value ? "bg-accent" : "bg-muted-foreground/30"
                  }`}
                />
                <span className="text-xs capitalize">{key}</span>
              </div>
            ))}
          </div>
        </ConfigSection>
      </div>
    </div>
  );
}
