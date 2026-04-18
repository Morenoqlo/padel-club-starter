import { mockEvents } from "@/lib/mock-data";
import { EventosClient } from "./eventos-client";

async function getEvents() {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    return data ?? mockEvents;
  } catch {
    return mockEvents;
  }
}

export default async function AdminEventosPage() {
  const events = await getEvents();
  return <EventosClient events={events as any} />;
}
