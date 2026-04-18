import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

function authGuard(req: NextRequest) {
  const secret = process.env.ADMIN_API_SECRET;
  if (!secret) return null;
  if (req.headers.get("x-admin-secret") !== secret) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}

// ── GET — leer configuración ──────────────────────────────────
export async function GET(req: NextRequest) {
  const authErr = authGuard(req);
  if (authErr) return authErr;

  try {
    const supabase = await createServiceClient();
    const { data } = await (supabase as any)
      .from("site_config")
      .select("*")
      .single();
    return NextResponse.json({ data: data ?? null });
  } catch {
    return NextResponse.json({ data: null });
  }
}

// ── POST — guardar/actualizar configuración ───────────────────
export async function POST(req: NextRequest) {
  const authErr = authGuard(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const supabase = await createServiceClient();

    // Upsert: si existe una fila, la actualiza; si no, la crea
    const { data, error } = await (supabase as any)
      .from("site_config")
      .upsert({ id: 1, ...body, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("[Config API]", err);
    return NextResponse.json(
      { error: err?.message ?? "Error al guardar" },
      { status: 500 }
    );
  }
}
