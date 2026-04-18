import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const ALLOWED_TABLES = [
  "products",
  "events",
  "classes",
  "faq",
  "testimonials",
  "orders",
  "gallery_items",
];

function guard(table: string) {
  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: "Tabla no permitida" }, { status: 400 });
  }
}

// ── INSERT ────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const { table, payload } = await req.json();
  const err = guard(table);
  if (err) return err;

  const supabase = await createServiceClient();
  const { data, error } = await (supabase as any)
    .from(table)
    .insert(payload)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// ── UPDATE ────────────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  const { table, id, payload } = await req.json();
  const err = guard(table);
  if (err) return err;

  const supabase = await createServiceClient();
  const { data, error } = await (supabase as any)
    .from(table)
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// ── DELETE ────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const { table, id } = await req.json();
  const err = guard(table);
  if (err) return err;

  const supabase = await createServiceClient();
  const { error } = await (supabase as any)
    .from(table)
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
