import type { Metadata } from "next";
import { getProducts, getProductCategories } from "@/services/products";
import { brandConfig } from "@/config/brand";
import { mockProducts } from "@/lib/mock-data";
import { TiendaClient } from "./tienda-client";

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
          <TiendaClient products={products} categories={categories} />
        </div>
      </section>
    </div>
  );
}
