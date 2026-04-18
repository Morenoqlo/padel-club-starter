import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un email válido"),
  phone: z.string().optional(),
  subject: z.string().min(5, "El asunto debe tener al menos 5 caracteres"),
  message: z.string().min(20, "El mensaje debe tener al menos 20 caracteres"),
});

export const checkoutSchema = z.object({
  email: z.string().email("Email inválido"),
  firstName: z.string().min(2, "Nombre requerido"),
  lastName: z.string().min(2, "Apellido requerido"),
  phone: z.string().optional(),
  address: z.string().min(5, "Dirección requerida"),
  city: z.string().min(2, "Ciudad requerida"),
  region: z.string().min(2, "Región requerida"),
  postalCode: z.string().optional(),
  paymentProvider: z.enum(["stripe", "mercadopago", "transbank"]),
  notes: z.string().optional(),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Contraseña mínimo 8 caracteres"),
});

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  compare_at_price: z.number().positive().optional(),
  category: z.string().min(2),
  tags: z.array(z.string()),
  is_active: z.boolean(),
  is_featured: z.boolean(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
