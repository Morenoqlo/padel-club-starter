import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/types";

export async function getTestimonials(options?: { limit?: number }): Promise<Testimonial[]> {
  const supabase = await createClient();
  let query = supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
