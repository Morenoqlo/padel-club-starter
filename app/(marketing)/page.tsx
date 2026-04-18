import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/hero";
import { BenefitsSection } from "@/components/sections/benefits";
import { CourtsSection } from "@/components/sections/courts";
import { EventsSection } from "@/components/sections/events-section";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { FAQSection } from "@/components/sections/faq-section";
import { CTAFinalSection } from "@/components/sections/cta-final";
import { getEvents } from "@/services/events";
import { getTestimonials } from "@/services/testimonials";
import { getFAQs } from "@/services/faq";
import { getProducts } from "@/services/products";
import { brandConfig } from "@/config/brand";
import { MerchSection } from "@/components/sections/merch-section";
import { ClassesSection } from "@/components/sections/classes-section";
import { getClasses } from "@/services/classes";
import {
  mockEvents, mockTestimonials, mockFAQs, mockProducts, mockClasses,
} from "@/lib/mock-data";

export const metadata: Metadata = {
  title: brandConfig.seo.defaultTitle,
  description: brandConfig.description,
};

export const revalidate = 300;

export default async function HomePage() {
  const [events, testimonials, faqs, products, classes] = await Promise.all([
    getEvents({ upcoming: true, featured: true, limit: 3 }).catch(() => mockEvents),
    getTestimonials({ limit: 4 }).catch(() => mockTestimonials),
    getFAQs({ limit: 8 }).catch(() => mockFAQs),
    getProducts({ featured: true, limit: 4 }).catch(() => mockProducts),
    getClasses({ featured: true, limit: 3 }).catch(() => mockClasses),
  ]);

  return (
    <>
      {brandConfig.sections.hero && <HeroSection />}
      {brandConfig.sections.benefits && <BenefitsSection />}
      {brandConfig.sections.courts && <CourtsSection />}
      {brandConfig.sections.classes && <ClassesSection classes={classes} />}
      {brandConfig.sections.events && <EventsSection events={events} />}
      {brandConfig.sections.merch && <MerchSection products={products} />}
      {brandConfig.sections.testimonials && (
        <TestimonialsSection testimonials={testimonials} />
      )}
      {brandConfig.sections.faq && <FAQSection faqs={faqs} />}
      {brandConfig.sections.ctaFinal && <CTAFinalSection />}
    </>
  );
}
