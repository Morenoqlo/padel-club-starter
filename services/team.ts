import { createClient } from "@/lib/supabase/server";

export interface TeamMember {
  id: string;
  created_at: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  object_position: string | null; // e.g. "50% 20%"
  sort_order: number | null;
  is_active: boolean;
}

export const mockTeam: TeamMember[] = [
  {
    id: "1",
    created_at: new Date().toISOString(),
    name: "Carlos Mendoza",
    role: "Director Técnico",
    bio: "Ex jugador profesional con 15 años de experiencia. Formado en la Academia Nacional de Pádel.",
    image_url:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600&h=800&q=80&auto=format&fit=crop&crop=face",
    object_position: "center top",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "2",
    created_at: new Date().toISOString(),
    name: "María González",
    role: "Head Coach — Academia",
    bio: "Instructora certificada nivel 3. Especialista en formación infantil y principiantes.",
    image_url:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&q=80&auto=format&fit=crop&crop=face",
    object_position: "center top",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "3",
    created_at: new Date().toISOString(),
    name: "Diego Fernández",
    role: "Coach Alto Rendimiento",
    bio: "Preparador físico y técnico para jugadores competitivos. +200 torneos disputados.",
    image_url:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&q=80&auto=format&fit=crop&crop=face",
    object_position: "center top",
    sort_order: 3,
    is_active: true,
  },
];

export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from("team_members")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return mockTeam;
    return data as TeamMember[];
  } catch {
    return mockTeam;
  }
}
