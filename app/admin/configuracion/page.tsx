import { brandConfig } from "@/config/brand";
import { ConfigClient } from "./config-client";

async function getSiteConfig() {
  try {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    const { data } = await (supabase as any)
      .from("site_config")
      .select("*")
      .eq("id", 1)
      .single();
    if (data) return data;
  } catch {
    // fall through to defaults
  }

  // Defaults from brand.ts
  return {
    club_name: brandConfig.name,
    tagline: brandConfig.tagline,
    email: brandConfig.contact.email,
    phone: brandConfig.contact.phone,
    whatsapp: brandConfig.contact.whatsapp,
    address: brandConfig.location.address,
    commune: brandConfig.location.commune,
    city: brandConfig.location.city,
    hours_weekdays: brandConfig.hours.weekdays,
    hours_weekends: brandConfig.hours.weekends,
    hours_holidays: brandConfig.hours.holidays,
    instagram: brandConfig.social.instagram,
    facebook: brandConfig.social.facebook,
    booking_url: brandConfig.booking.externalUrl,
    booking_cta: brandConfig.booking.ctaText,
    total_courts: brandConfig.facilities.totalCourts,
    indoor_courts: brandConfig.facilities.indoorCourts,
    outdoor_courts: brandConfig.facilities.outdoorCourts,
  };
}

export default async function AdminConfiguracionPage() {
  const config = await getSiteConfig();
  return <ConfigClient initial={config} />;
}
