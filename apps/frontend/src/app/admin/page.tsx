"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  AlertTriangle,
  ArrowUpRight,
  Package,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardStats {
  totalRevenue: number;
  ordersPaidCount: number;
  usersTotalCount: number;
  outOfStockProductsCount: number;
  lowStockProductsCount: number;
}

export default function AdminDashboardOverview() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        if (res.ok) {
          setStats(result.data);
        }
      } catch (err) {
        console.error("Erro ao carregar estatísticas", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="space-y-12 animate-pulse">
        <div className="h-20 w-1/3 bg-white/5 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  const cards = [
    { 
      label: "Receita Total", 
      value: `R$ ${stats?.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
      icon: TrendingUp, 
      color: "text-primary",
      bg: "bg-primary/10",
      trend: "+12.5%" 
    },
    { 
      label: "Pedidos Pagos", 
      value: stats?.ordersPaidCount || 0, 
      icon: ShoppingBag, 
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      trend: "+8%" 
    },
    { 
      label: "Total de Clientes", 
      value: stats?.usersTotalCount || 0, 
      icon: Users, 
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      trend: "+24" 
    },
    { 
      label: "Estoque Crítico", 
      value: stats?.lowStockProductsCount || 0, 
      icon: AlertTriangle, 
      color: stats?.lowStockProductsCount ? "text-orange-500" : "text-emerald-500",
      bg: stats?.lowStockProductsCount ? "bg-orange-500/10" : "bg-emerald-500/10",
      trend: stats?.outOfStockProductsCount ? `${stats.outOfStockProductsCount} esgotados` : "Estável"
    },
  ];

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-display uppercase italic font-black tracking-tighter leading-none mb-2">
            VISÃO <span className="text-primary">GERAL</span>
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">
            Monitoramento em tempo real do ecossistema Agon
          </p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-card/20 border border-border/40 backdrop-blur-md">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-foreground/80">30 Mar, 2026</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group p-8 rounded-[2rem] bg-card/10 border border-border/40 backdrop-blur-md hover:border-primary/40 transition-all duration-500 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${card.bg} rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition-opacity duration-1000`} />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className={`p-4 rounded-2xl ${card.bg} ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full uppercase tracking-tighter">
                <ArrowUpRight className="h-3 w-3" />
                {card.trend}
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">{card.label}</p>
              <h3 className="text-3xl font-display uppercase italic font-black tracking-tighter">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Grid: Insights & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        <div className="lg:col-span-8 p-10 rounded-[2.5rem] bg-card/10 border border-border/40 backdrop-blur-md relative overflow-hidden group">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-display uppercase italic font-black tracking-tighter">ALERTA DE <span className="text-primary">LOGÍSTICA</span></h2>
            <Package className="h-6 w-6 text-primary animate-bounce" />
          </div>
          
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-orange-500/5 border border-orange-500/20 flex items-center justify-between group hover:border-orange-500/40 transition-all duration-300">
               <div className="flex items-center gap-5">
                 <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                   <AlertTriangle className="h-6 w-6" />
                 </div>
                 <div>
                   <p className="text-xs font-black uppercase tracking-tight">Estoque Crítico Detectado</p>
                   <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Produtos abaixo do SRP (Safeguard Reserve Point)</p>
                 </div>
               </div>
               <button className="px-6 h-10 bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Ver Itens</button>
            </div>
            
            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex items-center justify-between group hover:border-primary/40 transition-all duration-300">
               <div className="flex items-center gap-5">
                 <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                   <ShoppingBag className="h-6 w-6" />
                 </div>
                 <div>
                   <p className="text-xs font-black uppercase tracking-tight">Faturamento Diário Recorde</p>
                   <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Desempenho 15% acima da média histórica móvel</p>
                 </div>
               </div>
               <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                 <ArrowUpRight className="h-5 w-5" />
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 p-10 rounded-[2.5rem] bg-primary border border-primary text-primary-foreground relative overflow-hidden group shadow-2xl shadow-primary/20">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2" />
          <h2 className="text-2xl font-display uppercase italic font-black tracking-tighter mb-4">AÇÕES <br /> RÁPIDAS</h2>
          <div className="space-y-3 relative z-10 pt-4">
            <button className="w-full h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-between px-6 hover:bg-white/30 transition-all font-display text-xs uppercase tracking-widest font-black">
              Novo Produto <Package className="h-4 w-4" />
            </button>
            <button className="w-full h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-between px-6 hover:bg-white/30 transition-all font-display text-xs uppercase tracking-widest font-black">
              Ver Pedidos <ShoppingBag className="h-4 w-4" />
            </button>
            <button className="w-full h-14 rounded-2xl bg-white border-primary text-primary flex items-center justify-between px-6 hover:scale-105 transition-all font-display text-xs uppercase tracking-widest font-black">
              Exportar CSV <TrendingUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
