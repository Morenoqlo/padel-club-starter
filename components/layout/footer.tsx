import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { brandConfig } from "@/config/brand";
import { navigationConfig } from "@/config/navigation";
import { whatsappUrl } from "@/lib/utils";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="container py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-background">
              <span className="text-accent">{brandConfig.sport.icon}</span>
              <span>{brandConfig.name}</span>
            </Link>
            <p className="mt-4 text-sm text-background/60 max-w-xs leading-relaxed">
              {brandConfig.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {brandConfig.social.instagram && (
                <a
                  href={brandConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-background/60 transition-colors hover:bg-accent hover:text-white"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {brandConfig.social.facebook && (
                <a
                  href={brandConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-background/60 transition-colors hover:bg-accent hover:text-white"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {brandConfig.social.youtube && (
                <a
                  href={brandConfig.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-background/60 transition-colors hover:bg-accent hover:text-white"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Nav columns */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-background/40 mb-4">
              El Club
            </p>
            <ul className="space-y-2.5">
              {navigationConfig.footer.club.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-background/60 transition-colors hover:text-background"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-background/40 mb-4">
              Servicios
            </p>
            <ul className="space-y-2.5">
              {navigationConfig.footer.services.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-background/60 transition-colors hover:text-background"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-background/40 mb-4">
              Información
            </p>
            <ul className="space-y-2.5">
              {navigationConfig.footer.info.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-background/60 transition-colors hover:text-background"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-background/40 mb-3">
                Contacto
              </p>
              <a
                href={`tel:${brandConfig.contact.phone}`}
                className="block text-sm text-background/60 hover:text-background transition-colors"
              >
                {brandConfig.contact.phone}
              </a>
              <a
                href={`mailto:${brandConfig.contact.email}`}
                className="block text-sm text-background/60 hover:text-background transition-colors"
              >
                {brandConfig.contact.email}
              </a>
              <a
                href={whatsappUrl(
                  brandConfig.contact.whatsapp,
                  brandConfig.contact.whatsappMessage
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-accent hover:text-accent/80 transition-colors font-medium"
              >
                WhatsApp →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 md:flex-row">
          <p className="text-xs text-background/40">
            © {year} {brandConfig.legal.companyName}. Todos los derechos reservados.
          </p>
          <p className="text-xs text-background/40">
            {brandConfig.location.address}, {brandConfig.location.city}
          </p>
        </div>
      </div>
    </footer>
  );
}
