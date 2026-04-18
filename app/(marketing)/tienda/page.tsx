import type { Metadata } from "next";
import { getProducts, getProductCategories } from "@/services/products";
import { ProductCard } from "@/components/shared/product-card";
import { brandConfig } from "@/config/brand";
import { mockProducts } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Tienda Oficial",
  description: `Equipamiento, ropa y accesorios oficiales de ${brandConfig.name}`,
};

export const revalidate = 300;

export default async function TiendaPage() {
  const [products, categories] = await Promise.all([
    getProducts().catch(() => mockProducts),
    getProductCategories().catch(() => ["accesorios", "ropa"]),
  ]);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="section-sm border-b border-border bg-secondary/30">
        <div className="container">
          <p className="label-overline mb-3">Tienda oficial</p>
          <h1 className="heading-xl">Equipamiento & Merch</h1>
          <p className="mt-4 body-lg max-w-xl">
            Todo lo que necesitas para jugar al máximo nivel. Productos oficiales
            del club con calidad premium.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Category filters */}
          {categories.length > 1 && (
            <div className="mb-10 flex flex-wrap gap-2">
              <button className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background">
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground capitalize hover:bg-secondary transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {products.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-muted-foreground">No hay productos disponibles.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
