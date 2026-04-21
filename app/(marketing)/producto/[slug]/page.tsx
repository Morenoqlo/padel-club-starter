import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/services/products";
import { ProductDetailClient } from "./product-detail-client";

// Always render on-demand (avoids build-time DB connection issues)
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    };
  } catch {
    return { title: "Producto" };
  }
}

export default async function ProductPage({ params }: Props) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) notFound();

    return <ProductDetailClient product={product} />;
  } catch (err) {
    // Re-throw Next.js control-flow errors (notFound/redirect)
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      typeof (err as { digest: unknown }).digest === "string" &&
      ((err as { digest: string }).digest.startsWith("NEXT_NOT_FOUND") ||
        (err as { digest: string }).digest.startsWith("NEXT_REDIRECT"))
    ) {
      throw err;
    }
    console.error("[ProductPage] Render error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return (
      <div className="container pt-28 pb-16">
        <h1 className="heading-lg mb-4">Producto no disponible</h1>
        <p className="text-muted-foreground mb-6">
          Estamos teniendo un problema temporal al mostrar este producto.
        </p>
        <pre className="text-xs bg-secondary p-4 rounded-lg overflow-auto">
          {message}
        </pre>
      </div>
    );
  }
}
