import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/types";

export async function getGalleryItems(options?: {
  featured?: boolean;
  category?: string;
  limit?: number;
}): Promise<GalleryItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order");

  if (options?.featured) query = query.eq("is_featured", true);
  if (options?.category) query = query.eq("category", options.category);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
