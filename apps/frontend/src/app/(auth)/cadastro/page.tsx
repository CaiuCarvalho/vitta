"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Cadastro Page
 * Redirects to the new unified /login?view=register page 
 * to maintain compatibility with existing links.
 */
export default function RedirectToRegister() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login?view=register");
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground">
          Carregando Arena Agon...
        </p>
      </div>
    </div>
  );
}
