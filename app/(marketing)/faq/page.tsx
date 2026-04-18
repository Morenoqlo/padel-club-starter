import type { Metadata } from "next";
import { getFAQs } from "@/services/faq";
import { FAQSection } from "@/components/sections/faq-section";
import { CTAFinalSection } from "@/components/sections/cta-final";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes",
  description: "Respuestas a las preguntas más comunes sobre reservas, clases, torneos y más.",
};

export const revalidate = 3600;

export default async function FAQPage() {
  const faqs = await getFAQs();

  return (
    <div className="pt-20">
      <section className="section-sm border-b border-border bg-secondary/30">
        <div className="container">
          <p className="label-overline mb-3">Ayuda</p>
          <h1 className="heading-xl">Preguntas frecuentes</h1>
        </div>
      </section>

      <FAQSection faqs={faqs} />
      <CTAFinalSection />
    </div>
  );
}
