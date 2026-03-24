export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import Background from "@/components/Background";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vitta — Cuidados Capilares Premium",
  description:
    "Fórmulas exclusivas que transformam cada fio. Cuidados capilares de luxo para quem valoriza a beleza autêntica.",
  keywords: ["cabelos", "cuidados capilares", "premium", "vitta", "sérum", "máscara capilar"],
  authors: [{ name: "Vitta" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen font-sans antialiased text-foreground">
        <CartProvider>
          <Background />
          {children}
          <Toaster />
          <Sonner />
        </CartProvider>
      </body>
    </html>
  );
}
