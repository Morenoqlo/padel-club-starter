/**
 * Database types — auto-generated from Supabase schema
 * Run: supabase gen types typescript --local > types/database.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          compare_at_price: number | null;
          images: string[];
          category: string;
          tags: string[];
          is_active: boolean;
          is_featured: boolean;
          stock_quantity: number | null;
          sku: string | null;
          metadata: Json | null;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          value: string;
          price_modifier: number;
          stock_quantity: number | null;
          sku: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["product_variants"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["product_variants"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          customer_email: string;
          customer_name: string;
          customer_phone: string | null;
          status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
          payment_status: "pending" | "paid" | "failed" | "refunded";
          payment_provider: "stripe" | "mercadopago" | "transbank" | null;
          payment_intent_id: string | null;
          subtotal: number;
          shipping_cost: number;
          tax: number;
          total: number;
          shipping_address: Json | null;
          notes: string | null;
          metadata: Json | null;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          variant_id: string | null;
          product_name: string;
          variant_name: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["order_items"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      gallery_items: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string | null;
          image_url: string | null;
          category: string | null;
          is_featured: boolean;
          is_active: boolean;
          sort_order: number | null;
          metadata: Json | null;
        };
        Insert: Omit<Database["public"]["Tables"]["gallery_items"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["gallery_items"]["Insert"]>;
      };
      events: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          slug: string;
          description: string | null;
          content: string | null;
          image_url: string | null;
          event_date: string;
          event_end_date: string | null;
          location: string | null;
          category: "tournament" | "social" | "workshop" | "clinic" | "other";
          price: number | null;
          max_participants: number | null;
          current_participants: number;
          registration_url: string | null;
          is_active: boolean;
          is_featured: boolean;
          metadata: Json | null;
        };
        Insert: Omit<Database["public"]["Tables"]["events"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
      };
      classes: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          slug: string;
          description: string | null;
          level: "beginner" | "intermediate" | "advanced" | "all";
          instructor: string | null;
          instructor_bio: string | null;
          instructor_image: string | null;
          schedule: Json;
          duration_minutes: number;
          price_per_session: number | null;
          price_monthly: number | null;
          max_students: number | null;
          image_url: string | null;
          is_active: boolean;
          is_featured: boolean;
          metadata: Json | null;
        };
        Insert: Omit<Database["public"]["Tables"]["classes"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["classes"]["Insert"]>;
      };
      testimonials: {
        Row: {
          id: string;
          created_at: string;
          author_name: string;
          author_role: string | null;
          author_image: string | null;
          content: string;
          rating: number;
          is_active: boolean;
          sort_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["testimonials"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
      };
      faq: {
        Row: {
          id: string;
          created_at: string;
          question: string;
          answer: string;
          category: string | null;
          sort_order: number;
          is_active: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["faq"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["faq"]["Insert"]>;
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["site_settings"]["Row"], "id" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      order_status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
      payment_status: "pending" | "paid" | "failed" | "refunded";
      class_level: "beginner" | "intermediate" | "advanced" | "all";
      event_category: "tournament" | "social" | "workshop" | "clinic" | "other";
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Insertable<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type Updatable<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
