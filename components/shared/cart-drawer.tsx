"use client";

import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCart, selectItemCount, selectSubtotal } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCart();
  const itemCount = useCart(selectItemCount);
  const subtotal = useCart(selectSubtotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="font-display font-semibold">
                  Carrito {itemCount > 0 && <span className="text-muted-foreground">({itemCount})</span>}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="rounded-full p-1.5 hover:bg-secondary transition-colors"
                aria-label="Cerrar carrito"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                  <p className="text-muted-foreground">Tu carrito está vacío</p>
                  <Button variant="outline" size="sm" onClick={closeCart} asChild>
                    <Link href="/tienda">Ver tienda</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="flex gap-4 rounded-xl border border-border p-3"
                    >
                      {item.image && (
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col gap-1 min-w-0">
                        <p className="text-sm font-medium leading-tight truncate">{item.name}</p>
                        {item.variantName && (
                          <p className="text-xs text-muted-foreground">{item.variantName}</p>
                        )}
                        <p className="text-sm font-bold text-accent">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-border hover:bg-secondary"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-border hover:bg-secondary"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.productId, item.variantId)}
                            className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                            aria-label="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-5 py-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Envío calculado en el checkout
                </p>
                <Button asChild className="w-full" onClick={closeCart}>
                  <Link href="/checkout">Continuar al pago</Link>
                </Button>
                <Button variant="outline" className="w-full" onClick={closeCart} asChild>
                  <Link href="/tienda">Seguir comprando</Link>
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
