"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { adminLoginSchema, type AdminLoginFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { brandConfig } from "@/config/brand";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error("Credenciales incorrectas");
      setIsLoading(false);
      return;
    }

    toast.success("Sesión iniciada");
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-foreground">
      <div className="w-full max-w-sm rounded-2xl bg-background p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
            <Lock className="h-6 w-6 text-accent" />
          </div>
          <h1 className="font-display text-2xl font-bold">Panel Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">{brandConfig.name}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
              placeholder="admin@club.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Contraseña</label>
            <input
              {...register("password")}
              type="password"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-11 font-semibold">
            {isLoading ? "Iniciando sesión..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
