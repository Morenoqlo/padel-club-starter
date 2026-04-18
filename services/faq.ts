import { createClient } from "@/lib/supabase/server";
import type { FAQ } from "@/types";

export async function getFAQs(options?: {
  category?: string;
  limit?: number;
}): Promise<FAQ[]> {
  const supabase = await createClient();
  let query = supabase
    .from("faq")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (options?.category) query = query.eq("category", options.category);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
