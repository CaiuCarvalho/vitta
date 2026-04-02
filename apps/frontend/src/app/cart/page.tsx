"use client";

import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { items, totalItems, subtotal, removeFromCart, updateQuantity } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  // Evita hidratação inconsistente entre server e client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-32 px-6 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="font-display text-4xl mb-4 uppercase italic font-black tracking-tighter">Seu carrinho está vazio</h1>
        <p className="text-muted-foreground max-w-md mb-10">Parece que você ainda não adicionou nenhum manto à sua coleção. Explore nossos lançamentos e escolha o seu.</p>
        <Link 
          href="/#produtos" 
          className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-full transition-all flex items-center gap-2 group"
        >
          Ver Produtos
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="container mx-auto py-20 px-6 md:px-12 pb-40">
      <h1 className="font-display text-5xl mb-12 uppercase italic font-black tracking-tighter">
        Seu <span className="text-primary">Carrinho</span>
      </h1>
      
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Lista de Itens */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-6 bg-card border border-border/40 p-5 rounded-2xl hover:border-primary/30 transition-colors group"
            >
              {/* Imagem do Produto */}
              <div className="relative w-24 h-24 bg-muted/30 rounded-xl overflow-hidden flex-shrink-0">
                 {/* Fallback pattern se não houver imagem real ainda */}
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                 {item.image_url && (
                    <Image 
                      src={item.image_url} 
                      alt={item.name} 
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                 )}
              </div>

              {/* Informações */}
              <div className="flex-grow">
                <h3 className="font-display text-xl uppercase italic font-bold tracking-tight mb-1">{item.name}</h3>
                <p className="text-primary font-bold text-lg">{formatCurrency(item.price)}</p>
              </div>

              {/* Controles de Quantidade */}
              <div className="flex items-center bg-background border border-border rounded-full p-1 h-fit">
                <button 
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-full transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-full transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Botão Remover */}
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-muted-foreground hover:text-destructive transition-colors p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Resumo */}
        <div className="bg-card border border-border/40 p-8 rounded-3xl h-fit sticky top-32">
          <h2 className="font-display text-2xl mb-8 uppercase italic font-black tracking-tight">Resumo do Pedido</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-muted-foreground font-medium">
              <span>Itens ({totalItems})</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground font-medium">
              <span>Frete</span>
              <span className="text-primary font-bold">Grátis</span>
            </div>
            <div className="pt-4 border-t border-border flex justify-between items-end">
              <div>
                <span className="text-sm text-muted-foreground block mb-1">Total</span>
                <span className="text-3xl font-black italic uppercase tracking-tighter text-foreground">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>
          </div>
          
          <Link 
            href="/checkout" 
            className="flex h-14 w-full items-center justify-center rounded-full bg-primary text-white font-black uppercase italic tracking-wider hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Ir para o Checkout
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          
          <p className="text-[10px] text-center text-muted-foreground mt-6 uppercase tracking-widest font-bold">
            🔒 Checkout Seguro & Criptografado
          </p>
        </div>
      </div>
    </div>
  );
}
