import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/services/products";
import { ProductDetailClient } from "./product-detail-client";

// Always render on-demand (avoids build-time DB connection issues)
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return { title: "Producto no encontrado" };

    return {
      title: product.name,
      description: product.description ?? undefined,
      openGraph: {
        images: product.images[0] ? [{ url: product.images[0] }] : [],
      },
    };
  } catch {
    return { title: "Producto" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  let product;
  try {
    product = await getProductBySlug(slug);
  } catch (err) {
    console.error("[ProductPage] Error fetching product:", err);
    notFound();
  }

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
