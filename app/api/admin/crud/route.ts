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

/** Verifica que la petición viene del panel admin legítimo */
function authGuard(req: NextRequest) {
  const secret = process.env.ADMIN_API_SECRET;
  // Si no hay secret configurado en el env, lo permitimos (modo dev sin configurar)
  if (!secret) return null;
  const header = req.headers.get("x-admin-secret");
  if (header !== secret) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}

function guard(table: string) {
  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: "Tabla no permitida" }, { status: 400 });
  }
}

// ── INSERT ────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const authErr = authGuard(req);
  if (authErr) return authErr;
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
  const authErr = authGuard(req);
  if (authErr) return authErr;
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
  const authErr = authGuard(req);
  if (authErr) return authErr;
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
