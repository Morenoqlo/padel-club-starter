"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const TIMEOUT_MS   = 3 * 60 * 1000; // 3 minutos de inactividad
const WARNING_MS   = 30 * 1000;      // advertencia 30 seg antes
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"] as const;

export function AdminTimeout() {
  const router        = useRouter();
  const timerRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnRef       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [warning, setWarning] = useState(false);
  const [secs, setSecs]       = useState(30);
  const countRef      = useRef<ReturnType<typeof setInterval> | null>(null);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }, [router]);

  const clearAll = useCallback(() => {
    if (timerRef.current)  clearTimeout(timerRef.current);
    if (warnRef.current)   clearTimeout(warnRef.current);
    if (countRef.current)  clearInterval(countRef.current);
  }, []);

  const resetTimer = useCallback(() => {
    clearAll();
    setWarning(false);
    setSecs(30);

    // Advertencia a los 2:30
    warnRef.current = setTimeout(() => {
      setWarning(true);
      setSecs(30);
      countRef.current = setInterval(() => {
        setSecs((s) => {
          if (s <= 1) {
            clearInterval(countRef.current!);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }, TIMEOUT_MS - WARNING_MS);

    // Cierre a los 3:00
    timerRef.current = setTimeout(() => {
      signOut();
    }, TIMEOUT_MS);
  }, [clearAll, signOut]);

  // Registrar eventos de actividad
  useEffect(() => {
    resetTimer();

    const handleActivity = () => resetTimer();
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }));

    // Cerrar sesión cuando se cierra/oculta la pestaña
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        // Pequeño delay: si vuelve antes de 2s, no cerrar (ej. cambiar de pestaña)
        const closeTimer = setTimeout(async () => {
          if (document.visibilityState === "hidden") {
            await signOut();
          }
        }, 2000);
        // Si vuelve, cancelar
        const cancelIfVisible = () => {
          if (document.visibilityState === "visible") {
            clearTimeout(closeTimer);
            document.removeEventListener("visibilitychange", cancelIfVisible);
          }
        };
        document.addEventListener("visibilitychange", cancelIfVisible);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearAll();
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, handleActivity));
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [resetTimer, clearAll, signOut]);

  if (!warning) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl border border-amber-500/30 bg-amber-50 dark:bg-amber-950/60 p-4 shadow-xl backdrop-blur">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-lg font-bold">
          {secs}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            Sesión por expirar
          </p>
          <p className="text-xs text-amber-700/80 dark:text-amber-400/70 mt-0.5">
            Sin actividad — se cerrará en {secs} segundo{secs !== 1 ? "s" : ""}.
          </p>
        </div>
      </div>
      <button
        onClick={resetTimer}
        className="mt-3 w-full rounded-xl bg-amber-500 py-2 text-xs font-semibold text-white hover:bg-amber-600 transition-colors"
      >
        Continuar sesión
      </button>
    </div>
  );
}
