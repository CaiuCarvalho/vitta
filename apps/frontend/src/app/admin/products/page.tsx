"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  category?: { name: string };
}

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ stock: number; price: number }>({ stock: 0, price: 0 });

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (res.ok) {
        setProducts(result.data.products);
      }
    } catch {
      toast.error("Erro ao carregar arsenal");
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchProducts();
  }, [token, fetchProducts]);

  const handleQuickEdit = (product: Product) => {
    setEditingId(product.id);
    setEditValues({ stock: product.stock, price: product.price });
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(editValues)
      });
      if (res.ok) {
        toast.success("Produto atualizado com sucesso");
        setEditingId(null);
        fetchProducts();
      } else {
        toast.error("Falha na atualização");
      }
    } catch {
      toast.error("Erro de conexão");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-display uppercase italic font-black tracking-tighter leading-none mb-2">
            GESTÃO DE <span className="text-primary">PRODUTOS</span>
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">
            Administre o arsenal Agon e controle o estoque premium
          </p>
        </div>
        <button className="h-14 px-8 bg-primary text-primary-foreground rounded-2xl flex items-center gap-3 font-display text-sm uppercase tracking-widest font-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,156,59,0.2)]">
          <Plus className="h-5 w-5" />
          Novo Item
        </button>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input 
            type="text"
            placeholder="BUSCAR NO ARSENAL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-16 bg-card/10 border border-border/40 rounded-2xl pl-16 pr-6 font-display text-xs uppercase tracking-widest focus:border-primary/60 focus:ring-1 focus:ring-primary/60 outline-none transition-all placeholder:text-muted-foreground/30"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card/5 border border-border/40 rounded-[2.5rem] backdrop-blur-md overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/20">
                <th className="p-8 text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground">Produto</th>
                <th className="p-8 text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground">Estoque</th>
                <th className="p-8 text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground">Preço (BRL)</th>
                <th className="p-8 text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode='popLayout'>
                {filteredProducts.map((product) => (
                  <motion.tr 
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group border-b border-border/10 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-8">
                       <div className="flex items-center gap-5">
                         <div className="h-16 w-16 rounded-2xl bg-muted/20 overflow-hidden border border-border/20 relative group-hover:border-primary/40 transition-colors">
                            {product.imageUrl ? (
                              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                            ) : (
                              <ImageIcon className="absolute inset-0 m-auto h-6 w-6 text-muted-foreground" />
                            )}
                            <button className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Edit3 className="h-4 w-4 text-white" />
                            </button>
                         </div>
                         <div>
                           <p className="font-display text-sm uppercase italic font-black tracking-tight">{product.name}</p>
                           <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{product.category?.name || "Premium Collection"}</p>
                         </div>
                       </div>
                    </td>
                    
                    <td className="p-8">
                      {editingId === product.id ? (
                        <input 
                          type="number"
                          value={editValues.stock}
                          onChange={(e) => setEditValues(v => ({ ...v, stock: parseInt(e.target.value) }))}
                          className="w-24 h-12 bg-background border border-primary/40 rounded-xl px-4 font-bold text-sm text-primary"
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className={`h-2 w-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'} shadow-[0_0_10px_currentColor]`} />
                          <span className="font-bold font-body">{product.stock} un.</span>
                        </div>
                      )}
                    </td>

                    <td className="p-8">
                      {editingId === product.id ? (
                        <input 
                          type="number"
                          value={editValues.price}
                          step="0.01"
                          onChange={(e) => setEditValues(v => ({ ...v, price: parseFloat(e.target.value) }))}
                          className="w-32 h-12 bg-background border border-primary/40 rounded-xl px-4 font-bold text-sm text-primary"
                        />
                      ) : (
                        <span className="font-bold font-body">R$ {product.price.toFixed(2)}</span>
                      )}
                    </td>

                    <td className="p-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {editingId === product.id ? (
                          <>
                            <button 
                              onClick={() => setEditingId(null)}
                              className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/10 text-muted-foreground hover:bg-muted/20"
                            >
                              <AlertCircle className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleUpdate(product.id)}
                              className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-white hover:scale-110 shadow-[0_0_15px_rgba(0,156,59,0.3)]"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleQuickEdit(product)}
                              className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/10 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/10 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/20">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
