import type { Metadata } from "next";
import { getGalleryItems } from "@/services/gallery";
import { brandConfig } from "@/config/brand";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Galería",
  description: `Conoce las instalaciones y momentos de ${brandConfig.name}`,
};

export const revalidate = 600;

// Mock gallery when Supabase isn't connected
const mockGallery = [
  {
    id: "1",
    created_at: new Date().toISOString(),
    title: "Canchas Indoor",
    description: "Vista panorámica de nuestras 4 canchas techadas",
    image_url: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80&auto=format&fit=crop",
    category: "instalaciones",
    sort_order: 1,
    is_featured: true,
    is_active: true,
  },
  {
    id: "2",
    created_at: new Date().toISOString(),
    title: "Canchas Outdoor",
    description: "Canchas al aire libre con vista panorámica",
    image_url: "https://images.unsplash.com/photo-1611457194403-d3aca4cf9d11?w=800&q=80&auto=format&fit=crop",
    category: "instalaciones",
    sort_order: 2,
    is_featured: true,
    is_active: true,
  },
  {
    id: "3",
    created_at: new Date().toISOString(),
    title: "Torneo Verano 2025",
    description: "Finales del torneo más emocionante del año",
    image_url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80&auto=format&fit=crop",
    category: "torneos",
    sort_order: 3,
    is_featured: false,
    is_active: true,
  },
  {
    id: "4",
    created_at: new Date().toISOString(),
    title: "Academia Infantil",
    description: "Nuestros pequeños jugadores en acción",
    image_url: "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=800&q=80&auto=format&fit=crop",
    category: "clases",
    sort_order: 4,
    is_featured: false,
    is_active: true,
  },
  {
    id: "5",
    created_at: new Date().toISOString(),
    title: "Pro Shop",
    description: "Todo el equipamiento que necesitas",
    image_url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80&auto=format&fit=crop",
    category: "instalaciones",
    sort_order: 5,
    is_featured: false,
    is_active: true,
  },
  {
    id: "6",
    created_at: new Date().toISOString(),
    title: "Clínica con Pros",
    description: "Entrenamiento con jugadores de nivel profesional",
    image_url: "https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=800&q=80&auto=format&fit=crop",
    category: "clases",
    sort_order: 6,
    is_featured: false,
    is_active: true,
  },
  {
    id: "7",
    created_at: new Date().toISOString(),
    title: "Área de calentamiento",
    description: "Gimnasio y área de calentamiento equipada",
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop",
    category: "instalaciones",
    sort_order: 7,
    is_featured: false,
    is_active: true,
  },
  {
    id: "8",
    created_at: new Date().toISOString(),
    title: "Noche de Pádel BBQ",
    description: "Evento social más esperado del año",
    image_url: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800&q=80&auto=format&fit=crop",
    category: "eventos",
    sort_order: 8,
    is_featured: false,
    is_active: true,
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  instalaciones: "Instalaciones",
  torneos: "Torneos",
  clases: "Clases",
  eventos: "Eventos",
  social: "Social",
};

export default async function GaleriaPage() {
  const rawItems = await getGalleryItems().catch(() => mockGallery);
  // Only show items that have an actual image URL
  const items = rawItems
    .filter((i) => typeof i.image_url === "string" && i.image_url.length > 0)
    .map((i) => ({ ...i, image_url: i.image_url as string }));

  const categories = [...new Set(items.map((i) => i.category).filter(Boolean))];
  const featured = items.filter((i) => i.is_featured).slice(0, 3);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="section-sm border-b border-border bg-secondary/30">
        <div className="container">
          <p className="label-overline mb-3">Instalaciones & momentos</p>
          <h1 className="heading-xl">Galería</h1>
          <p className="mt-4 body-lg max-w-xl">
            Conoce nuestras instalaciones de primera clase y revive los mejores
            momentos del club.
          </p>
        </div>
      </section>

      {/* Featured — bento grid */}
      {featured.length >= 3 && (
        <section className="section border-b border-border">
          <div className="container">
            <p className="label-overline mb-6">Destacados</p>
            <div className="grid grid-cols-2 grid-rows-2 gap-3 h-[480px] md:h-[560px]">
              {/* Main large */}
              <div className="row-span-2 relative overflow-hidden rounded-2xl bg-secondary">
                <Image
                  src={featured[0].image_url ?? ""}
                  alt={featured[0].title ?? "Galería"}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 40vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="font-display font-bold text-white text-sm">
                    {featured[0].title}
                  </p>
                </div>
              </div>
              {/* Top right */}
              <div className="relative overflow-hidden rounded-2xl bg-secondary">
                <Image
                  src={featured[1].image_url ?? ""}
                  alt={featured[1].title ?? "Galería"}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 40vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="font-display font-bold text-white text-sm">
                    {featured[1].title}
                  </p>
                </div>
              </div>
              {/* Bottom right */}
              <div className="relative overflow-hidden rounded-2xl bg-secondary">
                <Image
                  src={featured[2].image_url ?? ""}
                  alt={featured[2].title ?? "Galería"}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 40vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="font-display font-bold text-white text-sm">
                    {featured[2].title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All photos — masonry-style grid */}
      <section className="section">
        <div className="container">
          <p className="label-overline mb-8">Todas las fotos</p>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="break-inside-avoid overflow-hidden rounded-xl bg-secondary group relative"
              >
                <Image
                  src={item.image_url ?? ""}
                  alt={item.title ?? "Galería"}
                  width={600}
                  height={400}
                  unoptimized
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-3 opacity-0 group-hover:opacity-100">
                  <div>
                    <p className="font-medium text-white text-sm leading-tight">
                      {item.title}
                    </p>
                    {item.category && (
                      <p className="text-white/60 text-xs mt-0.5 capitalize">
                        {CATEGORY_LABELS[item.category] ?? item.category}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      {brandConfig.social.instagram && (
        <section className="section border-t border-border bg-secondary/30">
          <div className="container text-center">
            <p className="label-overline mb-4">Más contenido</p>
            <h2 className="heading-md mb-3">Síguenos en Instagram</h2>
            <p className="body-md mb-6">
              Publicamos fotos, videos y stories del club todos los días.
            </p>
            <a
              href={brandConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background hover:bg-foreground/90 transition-colors"
            >
              @{brandConfig.social.instagram.split("/").pop()}
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
