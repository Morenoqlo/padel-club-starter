"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { brandConfig } from "@/config/brand";
import { navigationConfig } from "@/config/navigation";
import { useCart, selectItemCount } from "@/hooks/use-cart";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-9" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
      aria-label="Cambiar tema"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { openCart } = useCart();
  const itemCount = useCart(selectItemCount);
  const { scrolled } = useScroll(20);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between md:h-18">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <span className="text-accent">{brandConfig.sport.icon}</span>
          <span>{brandConfig.shortName}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navigationConfig.main.slice(0, 6).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Dark mode */}
          <ThemeToggle />

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary transition-colors"
            aria-label={`Carrito (${itemCount} items)`}
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>

          {/* CTA */}
          <Button asChild size="sm" className="hidden md:inline-flex ml-2">
            <a
              href={brandConfig.booking.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {brandConfig.booking.ctaTextShort}
            </a>
          </Button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary transition-colors md:hidden"
            aria-label="Menú"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-border bg-background md:hidden"
          >
            <nav className="container flex flex-col gap-1 py-4">
              {navigationConfig.main.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 border-t border-border pt-2">
                <Button asChild className="w-full">
                  <a
                    href={brandConfig.booking.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {brandConfig.booking.ctaText}
                  </a>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
