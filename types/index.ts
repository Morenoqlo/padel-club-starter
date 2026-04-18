import type { Tables } from "./database";

// ── Re-exports from DB ────────────────────────────────────────
export type Product = Tables<"products">;
export type ProductVariant = Tables<"product_variants">;
export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;
export type GalleryItem = Tables<"gallery_items">;
export type Event = Tables<"events">;
export type Class = Tables<"classes">;
export type Testimonial = Tables<"testimonials">;
export type FAQ = Tables<"faq">;

// ── Cart ──────────────────────────────────────────────────────
export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

// ── Product with variants ─────────────────────────────────────
export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
}

// ── Checkout ──────────────────────────────────────────────────
export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address: string;
  city: string;
  region: string;
  postalCode?: string;
  paymentProvider: "stripe" | "mercadopago" | "transbank";
  notes?: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  region: string;
  postalCode?: string;
  country: string;
}

// ── Contact form ──────────────────────────────────────────────
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// ── API responses ─────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

// ── Navigation ────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
}

// ── Section props ─────────────────────────────────────────────
export interface SectionProps {
  className?: string;
}

// ── Image ─────────────────────────────────────────────────────
export interface ImageItem {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}
