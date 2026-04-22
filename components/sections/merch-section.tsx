"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface MerchSectionProps {
  products: Product[];
  className?: string;
}

export function MerchSection({ products, className }: MerchSectionProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector("article");
    const cardW = card ? card.offsetWidth + 24 : 300;
    scrollRef.current.scrollBy({ left: dir === "right" ? cardW : -cardW, behavior: "smooth" });
  };

  // Show max 5 products in the preview
  const preview = products.slice(0, 5);

  return (
    <section className={cn("section bg-secondary/30 overflow-hidden", className)} ref={ref}>
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10"
        >
          <div>
            <p className="label-overline mb-3">Tienda oficial</p>
            <h2 className="heading-xl">
              Lleva el club
              <br />
              <span className="text-muted-foreground">contigo.</span>
            </h2>
          </div>

          {/* Nav arrows + CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-secondary transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-secondary transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <Link
              href="/tienda"
              className="flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors"
            >
              Ver tienda completa
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth hide-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {preview.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="w-[260px] shrink-0 snap-start"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}

            {/* "Ver más" card */}
            <div className="w-[200px] shrink-0 snap-start flex items-center justify-center">
              <Link
                href="/tienda"
                className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border p-8 text-center hover:border-accent/50 hover:bg-accent/5 transition-colors group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <ArrowRight className="h-5 w-5 text-accent" />
                </div>
                <p className="text-sm font-semibold">Ver todos los productos</p>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
