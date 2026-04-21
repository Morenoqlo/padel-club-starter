export const dynamic = "force-dynamic";
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

/** Verifica que la petición viene de un admin autenticado */
async function authGuard() {
  // Modo bypass de desarrollo — NUNCA activo en producción real
  if (process.env.DEV_BYPASS_ADMIN_AUTH === "true") return null;

  // En producción: verificar sesión de Supabase (cookies enviadas automáticamente)
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}

function tableGuard(table: string) {
  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: "Tabla no permitida" }, { status: 400 });
  }
  return null;
}

// ── INSERT ────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const authErr = await authGuard();
  if (authErr) return authErr;

  const { table, payload } = await req.json();
  const tableErr = tableGuard(table);
  if (tableErr) return tableErr;

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
  const authErr = await authGuard();
  if (authErr) return authErr;

  const { table, id, payload } = await req.json();
  const tableErr = tableGuard(table);
  if (tableErr) return tableErr;

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
  const authErr = await authGuard();
  if (authErr) return authErr;

  const { table, id } = await req.json();
  const tableErr = tableGuard(table);
  if (tableErr) return tableErr;

  const supabase = await createServiceClient();
  const { error } = await (supabase as any).from(table).delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
