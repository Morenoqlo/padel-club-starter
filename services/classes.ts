import { createClient } from "@/lib/supabase/server";
import type { Class } from "@/types";

export async function getClasses(options?: {
  featured?: boolean;
  level?: string;
  limit?: number;
}): Promise<Class[]> {
  const supabase = await createClient();
  let query = supabase
    .from("classes")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (options?.featured) query = query.eq("is_featured", true);
  if (options?.level) query = query.eq("level", options.level);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
