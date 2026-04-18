import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

async function authGuard() {
  if (process.env.DEV_BYPASS_ADMIN_AUTH === "true") return null;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return null;
}

export async function GET(req: NextRequest) {
  const authErr = await authGuard();
  if (authErr) return authErr;

  try {
    const supabase = await createServiceClient();
    const { data } = await (supabase as any)
      .from("site_config")
      .select("*")
      .eq("id", 1)
      .single();
    return NextResponse.json({ data: data ?? null });
  } catch {
    return NextResponse.json({ data: null });
  }
}

export async function POST(req: NextRequest) {
  const authErr = await authGuard();
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const supabase = await createServiceClient();
    const { data, error } = await (supabase as any)
      .from("site_config")
      .upsert({ id: 1, ...body, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("[Config API]", err);
    return NextResponse.json({ error: err?.message ?? "Error al guardar" }, { status: 500 });
  }
}
