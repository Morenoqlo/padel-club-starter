import type { MetadataRoute } from "next";
import { getProducts } from "@/services/products";
import { getEvents } from "@/services/events";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, events] = await Promise.all([
    getProducts().catch(() => []),
    getEvents().catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: new Date(), priority: 1 },
    { url: absoluteUrl("/club"), lastModified: new Date(), priority: 0.8 },
    { url: absoluteUrl("/reservas"), lastModified: new Date(), priority: 0.9 },
    { url: absoluteUrl("/clases"), lastModified: new Date(), priority: 0.8 },
    { url: absoluteUrl("/eventos"), lastModified: new Date(), priority: 0.8 },
    { url: absoluteUrl("/galeria"), lastModified: new Date(), priority: 0.6 },
    { url: absoluteUrl("/tienda"), lastModified: new Date(), priority: 0.8 },
    { url: absoluteUrl("/contacto"), lastModified: new Date(), priority: 0.7 },
    { url: absoluteUrl("/faq"), lastModified: new Date(), priority: 0.6 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: absoluteUrl(`/producto/${p.slug}`),
    lastModified: new Date(p.updated_at),
    priority: 0.7,
  }));

  const eventRoutes: MetadataRoute.Sitemap = events.map((e) => ({
    url: absoluteUrl(`/eventos/${e.slug}`),
    lastModified: new Date(e.updated_at),
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...eventRoutes];
}
