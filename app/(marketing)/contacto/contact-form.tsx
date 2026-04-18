"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error al enviar");
      toast.success("Mensaje enviado. Te responderemos pronto.");
      reset();
    } catch {
      toast.error("Hubo un error. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Nombre</label>
          <input
            {...register("name")}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors"
            placeholder="Tu nombre"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors"
            placeholder="tu@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Teléfono (opcional)</label>
        <input
          {...register("phone")}
          type="tel"
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors"
          placeholder="+56 9 1234 5678"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Asunto</label>
        <input
          {...register("subject")}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors"
          placeholder="¿En qué te podemos ayudar?"
        />
        {errors.subject && (
          <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Mensaje</label>
        <textarea
          {...register("message")}
          rows={5}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent transition-colors resize-none"
          placeholder="Cuéntanos en qué te podemos ayudar..."
        />
        {errors.message && (
          <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-base font-semibold">
        {isSubmitting ? (
          "Enviando..."
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" /> Enviar mensaje
          </>
        )}
      </Button>
    </form>
  );
}
