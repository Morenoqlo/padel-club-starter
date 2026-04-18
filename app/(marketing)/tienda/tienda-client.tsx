"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/shared/product-card";
import type { Product } from "@/types";

interface TiendaClientProps {
  products: Product[];
  categories: string[];
}

export function TiendaClient({ products, categories }: TiendaClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("todos");

  const filtered = useMemo(() => {
    if (activeCategory === "todos") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <>
      {/* Category filters */}
      {categories.length > 1 && (
        <div className="mb-10 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("todos")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === "todos"
                ? "bg-foreground text-background"
                : "border border-border text-foreground hover:bg-secondary"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                activeCategory === cat
                  ? "bg-foreground text-background"
                  : "border border-border text-foreground hover:bg-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-muted-foreground text-lg mb-2">
            No hay productos en esta categoría.
          </p>
          <button
            onClick={() => setActiveCategory("todos")}
            className="text-sm text-accent underline underline-offset-4"
          >
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
