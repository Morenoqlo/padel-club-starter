"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/product-card";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface MerchSectionProps {
  products: Product[];
  className?: string;
}

export function MerchSection({ products, className }: MerchSectionProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className={cn("section bg-secondary/30", className)} ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <p className="label-overline mb-3">Tienda oficial</p>
            <h2 className="heading-xl">
              Lleva el club
              <br />
              <span className="text-muted-foreground">contigo.</span>
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/tienda">
              Ver tienda completa
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
