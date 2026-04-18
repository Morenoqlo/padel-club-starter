"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQ } from "@/types";
import { cn } from "@/lib/utils";

interface FAQSectionProps {
  faqs: FAQ[];
  className?: string;
}

export function FAQSection({ faqs, className }: FAQSectionProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className={cn("section bg-background", className)} ref={ref}>
      <div className="container">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.5fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
          >
            <p className="label-overline mb-3">FAQ</p>
            <h2 className="heading-xl">
              Preguntas
              <br />
              <span className="text-muted-foreground">frecuentes.</span>
            </h2>
            <p className="mt-4 body-md">
              ¿No encuentras lo que buscas? Escríbenos por WhatsApp o
              al correo y te respondemos en minutos.
            </p>
          </motion.div>

          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="rounded-xl border border-border px-5"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
