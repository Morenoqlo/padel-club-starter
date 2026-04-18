import { mockProducts } from "@/lib/mock-data";
import { ProductosClient } from "./productos-client";

async function getProducts() {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    return data ?? mockProducts;
  } catch {
    return mockProducts;
  }
}

export default async function AdminProductosPage() {
  const products = await getProducts();
  return <ProductosClient products={products as any} />;
}
