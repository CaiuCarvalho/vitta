"use client";

import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  const { items, totalFavorites, isLoading } = useWishlist();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4 md:px-8">
      {/* Header da Coleção */}
      <div className="max-w-7xl mx-auto mb-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-3 w-3" />
          Voltar para a Loja
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-4">
              MEUS <span className="text-primary">FAVORITOS</span>
            </h1>
            <p className="text-muted-foreground uppercase text-xs font-bold tracking-widest">
              Sua curadoria de elite — {totalFavorites} {totalFavorites === 1 ? "Item" : "Itens"} selecionados
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="popLayout">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {items.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard
                    id={product.id}
                    title={product.name}
                    price={product.price}
                    image={product.image_url || "/placeholder.png"}
                    category="Manto Selecionado"
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="h-24 w-24 rounded-full bg-muted/20 flex items-center justify-center mb-6">
                <Heart className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <h2 className="font-display text-3xl font-black uppercase italic tracking-tight mb-4">
                SUA LISTA ESTÁ VAZIA
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mb-8 px-4">
                Explore nossa coleção de elite e selecione os mantos que definem sua paixão pelo futebol. Eles aparecerão aqui.
              </p>
              <Link href="/">
                <button className="h-14 px-10 bg-foreground text-background font-display text-xl uppercase italic font-black tracking-widest rounded-full hover:bg-primary transition-all hover:scale-105 active:scale-95 group flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5" />
                  Descobrir Mantos
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Rodapé Decorativo */}
      {items.length > 0 && (
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-border/20 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
            Agon Elite Curated Collection • 2026
          </p>
        </div>
      )}
    </div>
  );
}
