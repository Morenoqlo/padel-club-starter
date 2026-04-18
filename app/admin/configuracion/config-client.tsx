"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SiteConfig {
  club_name: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  commune: string;
  city: string;
  hours_weekdays: string;
  hours_weekends: string;
  hours_holidays: string;
  instagram: string;
  facebook: string;
  booking_url: string;
  booking_cta: string;
  total_courts: number;
  indoor_courts: number;
  outdoor_courts: number;
}

interface ConfigClientProps {
  initial: SiteConfig;
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background overflow-hidden">
      <div className="border-b border-border px-5 py-4">
        <h2 className="font-semibold text-sm">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ConfigClient({ initial }: ConfigClientProps) {
  const [cfg, setCfg] = useState<SiteConfig>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set(key: keyof SiteConfig) {
    return (v: string) => {
      setSaved(false);
      setCfg((prev) => ({ ...prev, [key]: key.includes("courts") ? Number(v) : v }));
    };
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_API_SECRET ?? "",
        },
        body: JSON.stringify(cfg),
      });
      if (!res.ok) throw new Error("Error al guardar");
      setSaved(true);
      toast.success("Configuración guardada correctamente");
    } catch {
      toast.error("No se pudo guardar la configuración");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Configuración</h1>
          <p className="text-sm text-muted-foreground">
            Edita los datos del club. Los cambios se guardan en la base de datos.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="gap-2 shrink-0"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Guardando…" : saved ? "Guardado" : "Guardar cambios"}
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Identity */}
        <Section title="Identidad del club">
          <Field label="Nombre del club" value={cfg.club_name} onChange={set("club_name")} placeholder="Padel Pro Club" />
          <Field label="Tagline / Eslogan" value={cfg.tagline} onChange={set("tagline")} placeholder="Tu cancha te espera" />
        </Section>

        {/* Contact */}
        <Section title="Contacto">
          <Field label="Email" value={cfg.email} onChange={set("email")} type="email" placeholder="contacto@club.com" />
          <Field label="Teléfono" value={cfg.phone} onChange={set("phone")} placeholder="+56 9 1234 5678" />
          <Field label="WhatsApp (sin +)" value={cfg.whatsapp} onChange={set("whatsapp")} placeholder="56912345678" />
        </Section>

        {/* Location */}
        <Section title="Ubicación">
          <Field label="Dirección" value={cfg.address} onChange={set("address")} placeholder="Av. Deportiva 1234" />
          <Field label="Comuna / Barrio" value={cfg.commune} onChange={set("commune")} placeholder="Las Condes" />
          <Field label="Ciudad" value={cfg.city} onChange={set("city")} placeholder="Santiago" />
        </Section>

        {/* Hours */}
        <Section title="Horarios">
          <Field label="Lunes–Viernes" value={cfg.hours_weekdays} onChange={set("hours_weekdays")} placeholder="07:00 – 23:00" />
          <Field label="Sábado–Domingo" value={cfg.hours_weekends} onChange={set("hours_weekends")} placeholder="08:00 – 22:00" />
          <Field label="Festivos" value={cfg.hours_holidays} onChange={set("hours_holidays")} placeholder="09:00 – 20:00" />
        </Section>

        {/* Social */}
        <Section title="Redes sociales">
          <Field label="Instagram URL" value={cfg.instagram} onChange={set("instagram")} placeholder="https://instagram.com/club" />
          <Field label="Facebook URL" value={cfg.facebook} onChange={set("facebook")} placeholder="https://facebook.com/club" />
        </Section>

        {/* Booking */}
        <Section title="Sistema de reservas">
          <Field label="URL de reservas" value={cfg.booking_url} onChange={set("booking_url")} placeholder="https://reservas.tuclub.com" />
          <Field label="Texto del botón CTA" value={cfg.booking_cta} onChange={set("booking_cta")} placeholder="Reservar Cancha" />
        </Section>

        {/* Facilities */}
        <Section title="Instalaciones">
          <div className="grid grid-cols-3 gap-3">
            <Field label="Total canchas" value={cfg.total_courts} onChange={set("total_courts")} type="number" />
            <Field label="Indoor" value={cfg.indoor_courts} onChange={set("indoor_courts")} type="number" />
            <Field label="Outdoor" value={cfg.outdoor_courts} onChange={set("outdoor_courts")} type="number" />
          </div>
        </Section>
      </div>

      {/* Save button bottom */}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Guardando…" : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
}
