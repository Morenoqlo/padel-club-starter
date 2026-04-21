export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "Fotos";
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

async function authGuard() {
  if (process.env.DEV_BYPASS_ADMIN_AUTH === "true") return null;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return null;
}

export async function POST(req: NextRequest) {
  const authErr = await authGuard();
  if (authErr) return authErr;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipo no permitido. Usa: ${ALLOWED_TYPES.map((t) => t.split("/")[1]).join(", ")}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `El archivo supera el límite de ${MAX_SIZE_MB}MB` },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const ts = Date.now();
    const rand = Math.random().toString(36).slice(2, 8);
    const fileName = `${ts}-${rand}.${ext}`;
    const folder = (formData.get("folder") as string) ?? "general";
    const path = `${folder}/${fileName}`;

    const supabase = await createServiceClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error("[Upload]", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Try public URL first; fall back to signed URL (10 years) if bucket is private
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);

    // Check if public URL works by testing the bucket visibility
    const { data: signedData, error: signErr } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10); // 10 years

    const url = signErr ? publicUrl : (signedData?.signedUrl ?? publicUrl);

    return NextResponse.json({ url, path });
  } catch (err: any) {
    console.error("[Upload API]", err);
    return NextResponse.json({ error: err?.message ?? "Error al subir" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authErr = await authGuard();
  if (authErr) return authErr;

  try {
    const { path } = await req.json();
    if (!path) return NextResponse.json({ error: "Falta el path" }, { status: 400 });

    const supabase = await createServiceClient();
    const { error } = await supabase.storage.from(BUCKET).remove([path]);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Error al eliminar" }, { status: 500 });
  }
}
