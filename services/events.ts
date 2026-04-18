import { createClient } from "@/lib/supabase/server";
import type { Event } from "@/types";

export async function getEvents(options?: {
  featured?: boolean;
  upcoming?: boolean;
  limit?: number;
}): Promise<Event[]> {
  const supabase = await createClient();
  let query = supabase
    .from("events")
    .select("*")
    .eq("is_active", true)
    .order("event_date", { ascending: true });

  if (options?.featured) query = query.eq("is_featured", true);
  if (options?.upcoming) query = query.gte("event_date", new Date().toISOString());
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data;
}
