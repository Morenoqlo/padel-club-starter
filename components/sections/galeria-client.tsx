"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: string;
  title?: string | null;
  description?: string | null;
  image_url: string;
  category?: string | null;
  is_featured?: boolean | null;
}

interface GaleriaClientProps {
  items: GalleryItem[];
  featured: GalleryItem[];
  categoryLabels: Record<string, string>;
}

export function GaleriaClient({ items, featured, categoryLabels }: GaleriaClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % items.length));
  }, [items.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + items.length) % items.length));
  }, [items.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, closeLightbox, goNext, goPrev]);

  // Clean up on unmount
  useEffect(() => () => { document.body.style.overflow = ""; }, []);

  const currentItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <>
      {/* Featured — bento grid */}
      {featured.length >= 3 && (
        <section className="section border-b border-border">
          <div className="container">
            <p className="label-overline mb-6">Destacados</p>
            <div className="grid grid-cols-2 grid-rows-2 gap-3 h-[480px] md:h-[560px]">
              {/* Main large */}
              <button
                onClick={() => openLightbox(items.findIndex((i) => i.id === featured[0].id))}
                className="row-span-2 relative overflow-hidden rounded-2xl bg-secondary group cursor-zoom-in"
              >
                <img
                  src={featured[0].image_url}
                  alt={featured[0].title ?? "Galería"}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="font-display font-bold text-white text-sm">{featured[0].title}</p>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="rounded-full bg-white/20 backdrop-blur p-3">
                    <ZoomIn className="h-6 w-6 text-white" />
                  </div>
                </div>
              </button>
              {/* Top right */}
              <button
                onClick={() => openLightbox(items.findIndex((i) => i.id === featured[1].id))}
                className="relative overflow-hidden rounded-2xl bg-secondary group cursor-zoom-in"
              >
                <img
                  src={featured[1].image_url}
                  alt={featured[1].title ?? "Galería"}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="font-display font-bold text-white text-sm">{featured[1].title}</p>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="rounded-full bg-white/20 backdrop-blur p-3">
                    <ZoomIn className="h-6 w-6 text-white" />
                  </div>
                </div>
              </button>
              {/* Bottom right */}
              <button
                onClick={() => openLightbox(items.findIndex((i) => i.id === featured[2].id))}
                className="relative overflow-hidden rounded-2xl bg-secondary group cursor-zoom-in"
              >
                <img
                  src={featured[2].image_url}
                  alt={featured[2].title ?? "Galería"}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="font-display font-bold text-white text-sm">{featured[2].title}</p>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="rounded-full bg-white/20 backdrop-blur p-3">
                    <ZoomIn className="h-6 w-6 text-white" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* All photos — masonry grid */}
      <section className="section">
        <div className="container">
          <p className="label-overline mb-8">Todas las fotos</p>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => openLightbox(index)}
                className="break-inside-avoid overflow-hidden rounded-xl bg-secondary group relative w-full cursor-zoom-in"
              >
                <img
                  src={item.image_url}
                  alt={item.title ?? "Galería"}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-3 opacity-0 group-hover:opacity-100">
                  <div>
                    <p className="font-medium text-white text-sm leading-tight text-left">
                      {item.title}
                    </p>
                    {item.category && (
                      <p className="text-white/60 text-xs mt-0.5 capitalize text-left">
                        {categoryLabels[item.category] ?? item.category}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && currentItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Counter */}
          <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
            {lightboxIndex + 1} / {items.length}
          </div>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Image */}
          <div
            className="relative max-h-[85vh] max-w-[90vw] md:max-w-[80vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentItem.image_url}
              alt={currentItem.title ?? "Galería"}
              className="max-h-[80vh] max-w-[90vw] md:max-w-[80vw] rounded-xl object-contain shadow-2xl"
            />
            {/* Caption */}
            {(currentItem.title || currentItem.description) && (
              <div className="mt-3 text-center">
                {currentItem.title && (
                  <p className="font-display font-semibold text-white">{currentItem.title}</p>
                )}
                {currentItem.description && (
                  <p className="text-sm text-white/60 mt-1">{currentItem.description}</p>
                )}
                {currentItem.category && (
                  <span className="mt-2 inline-block rounded-full bg-accent/20 px-2.5 py-0.5 text-xs text-accent capitalize">
                    {categoryLabels[currentItem.category] ?? currentItem.category}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
