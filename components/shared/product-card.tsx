"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Star, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      image: product.images[0] ?? "",
      slug: product.slug,
    });
    toast.success(`${qty > 1 ? `${qty}× ` : ""}${product.name} añadido al carrito`);
    setQty(1);
  };

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        className
      )}
    >
      {/* Image */}
      <Link href={`/producto/${product.slug}`} className="relative block overflow-hidden bg-secondary aspect-square">
        {product.images[0] && (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        {discount && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        {product.is_featured && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-foreground/80 px-2.5 py-1 text-xs font-semibold text-background">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            Destacado
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/producto/${product.slug}`}>
          <h3 className="font-display font-semibold leading-tight mb-1 hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-bold">
              {formatPrice(product.price * qty)}
            </span>
            {product.compare_at_price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Quantity selector */}
            <div className="flex items-center rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
                aria-label="Menos"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <button
                onClick={() => setQty(q => Math.min(99, q + 1))}
                className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
                aria-label="Más"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            {/* Add to cart */}
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="flex-1 h-8 gap-1.5 text-xs"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Agregar
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
