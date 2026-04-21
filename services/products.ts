import { createClient } from "@/lib/supabase/server";
import type { Product, ProductWithVariants } from "@/types";

export async function getProducts(options?: {
  featured?: boolean;
  category?: string;
  limit?: number;
}): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (options?.featured) query = query.eq("is_featured", true);
  if (options?.category) query = query.eq("category", options.category);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<ProductWithVariants | null> {
  const supabase = await createClient();

  // Fetch product and variants separately so one failing doesn't kill the other
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !product) return null;

  // Fetch variants (non-critical — empty array if fails)
  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", (product as { id: string }).id)
    .eq("is_active", true);

  const p = product as Product;
  return {
    ...p,
    images: Array.isArray(p.images) ? p.images : [],
    tags: Array.isArray(p.tags) ? p.tags : [],
    variants: (variants as ProductWithVariants["variants"]) ?? [],
  };
}

export async function getProductCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("category")
    .eq("is_active", true);

  if (!data) return [];
  return [...new Set((data as Array<{ category: string }>).map((p) => p.category))];
}
