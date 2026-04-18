"use client";

import { useEffect } from "react";
import { useCart } from "@/hooks/use-cart";

/**
 * Triggers Zustand persist rehydration from localStorage on the client.
 * Must be rendered inside a client boundary (e.g. root layout).
 * skipHydration: true in the store prevents SSR crashes on localStorage access.
 */
export function CartHydration() {
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);

  return null;
}
