"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ShoppingBag, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import type { ProductWithVariants } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface Props {
  product: ProductWithVariants;
}

export function ProductDetailClient({ product }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const variantGroups = product.variants.reduce<Record<string, typeof product.variants>>(
    (acc, v) => {
      if (!acc[v.name]) acc[v.name] = [];
      acc[v.name].push(v);
      return acc;
    },
    {}
  );

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant ?? undefined,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] ?? "",
      slug: product.slug,
    });
    setAdded(true);
    toast.success("Añadido al carrito");
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container pt-28 pb-16">
      <Link
        href="/tienda"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a la tienda
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square overflow-hidden rounded-2xl bg-secondary">
            {product.images[activeImage] && (
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition-all ${
                    i === activeImage ? "border-accent" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="label-overline mb-2 text-accent">{product.category}</p>
          <h1 className="heading-lg mb-4">{product.name}</h1>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.compare_at_price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>
          )}

          {/* Variant selectors */}
          {Object.entries(variantGroups).map(([groupName, variants]) => (
            <div key={groupName} className="mb-6">
              <p className="text-sm font-semibold mb-3">{groupName}</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.id)}
                    disabled={!v.is_active}
                    className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                      selectedVariant === v.id
                        ? "border-accent bg-accent/5 text-accent"
                        : "border-border hover:border-foreground/40"
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {v.value}
                    {v.price_modifier !== 0 && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        {v.price_modifier > 0 ? "+" : ""}
                        {formatPrice(v.price_modifier)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* CTA */}
          <Button
            size="lg"
            onClick={handleAddToCart}
            className="w-full h-12 text-base font-semibold"
          >
            {added ? (
              <>
                <Check className="mr-2 h-5 w-5" /> Añadido
              </>
            ) : (
              <>
                <ShoppingBag className="mr-2 h-5 w-5" /> Añadir al carrito
              </>
            )}
          </Button>

          {product.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
