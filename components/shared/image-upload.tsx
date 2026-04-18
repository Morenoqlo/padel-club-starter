"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Link2, X, ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  aspectRatio?: "video" | "square" | "auto";
}

type Mode = "upload" | "url";

export function ImageUpload({
  value,
  onChange,
  folder = "general",
  aspectRatio = "video",
}: ImageUploadProps) {
  const [mode, setMode] = useState<Mode>("upload");
  const [urlInput, setUrlInput] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const aspectClass = {
    video: "aspect-video",
    square: "aspect-square",
    auto: "aspect-[4/3]",
  }[aspectRatio];

  // ── Upload file ────────────────────────────────────────────────

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "same-origin",
        body: fd,
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error ?? "Error al subir");

      onChange(json.url);
      setUrlInput(json.url);
      setImgError(false);
      toast.success("Imagen subida correctamente");
    } catch (err: any) {
      toast.error(err?.message ?? "Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  }, [folder, onChange]);

  // ── Handlers ───────────────────────────────────────────────────

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) uploadFile(file);
    else toast.error("Solo se permiten imágenes");
  }

  function handleUrlApply() {
    const url = urlInput.trim();
    if (!url) return;
    onChange(url);
    setImgError(false);
    toast.success("URL aplicada");
  }

  function handleClear() {
    onChange("");
    setUrlInput("");
    setImgError(false);
  }

  // ── Render ─────────────────────────────────────────────────────

  return (
    <div className="space-y-3">
      {/* Mode tabs */}
      <div className="flex rounded-lg border border-border p-1 bg-secondary/30 w-fit gap-1">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === "upload"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload className="h-3.5 w-3.5" />
          Subir archivo
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === "url"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Link2 className="h-3.5 w-3.5" />
          URL externa
        </button>
      </div>

      {/* Upload zone */}
      {mode === "upload" && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileRef.current?.click()}
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all cursor-pointer select-none ${aspectClass} ${
            dragOver
              ? "border-accent bg-accent/5 scale-[1.01]"
              : "border-border hover:border-accent/50 hover:bg-secondary/50"
          } ${uploading ? "pointer-events-none" : ""}`}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={handleFileChange}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <p className="text-sm font-medium">Subiendo imagen…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {dragOver ? "Suelta aquí" : "Arrastra o haz clic para subir"}
                </p>
                <p className="text-xs mt-0.5">JPG, PNG, WEBP · Máx. 5MB</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* URL input */}
      {mode === "url" && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlApply()}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
          />
          <button
            type="button"
            onClick={handleUrlApply}
            className="rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
          >
            Aplicar
          </button>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className={`relative overflow-hidden rounded-xl bg-secondary ${aspectClass}`}>
          {imgError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <AlertCircle className="h-6 w-6" />
              <p className="text-xs">No se puede cargar la imagen</p>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
              onLoad={() => setImgError(false)}
            />
          )}

          {/* Clear button */}
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
            title="Quitar imagen"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          {/* No image fallback overlay */}
          {!value && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImageIcon className="h-8 w-8 opacity-30" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
