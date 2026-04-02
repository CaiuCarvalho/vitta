"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Eye
} from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion"; // Unused in this view
import { toast } from "sonner";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  trackingCode: string | null;
  user: { name: string; email: string };
  items: unknown[];
}

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [trackingCode, setTrackingCode] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (res.ok) {
        setOrders(result.data.orders);
      }
    } catch {
      toast.error("Erro ao carregar pedidos");
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchOrders();
  }, [token, fetchOrders]);

  const handleUpdateTracking = async (id: string) => {
    if (!trackingCode) {
      toast.error("Insira um código de rastreio");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}/tracking`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ trackingCode })
      });
      if (res.ok) {
        toast.success("Rastreio atualizado e e-mail enviado!");
        setUpdatingId(null);
        setTrackingCode("");
        fetchOrders();
      } else {
        toast.error("Erro ao atualizar rastreio");
      }
    } catch {
      toast.error("Erro de conexão");
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'PAID': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'SHIPPED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'FAILED': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'PAID': return <CheckCircle2 className="h-3 w-3" />;
      case 'SHIPPED': return <Truck className="h-3 w-3" />;
      case 'FAILED': return <XCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl md:text-6xl font-display uppercase italic font-black tracking-tighter leading-none mb-2">
          CENTRAL DE <span className="text-primary">PEDIDOS</span>
        </h1>
        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em]">
          Gerencie o fulfillment e acompanhe o fluxo de vendas elite
        </p>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input 
          type="text"
          placeholder="BUSCAR POR ID OU CLIENTE..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-16 bg-card/10 border border-border/40 rounded-2xl pl-16 pr-6 font-display text-xs uppercase tracking-widest focus:border-primary/60 outline-none transition-all placeholder:text-muted-foreground/30"
        />
      </div>

      <div className="bg-card/5 border border-border/40 rounded-[2.5rem] backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/20">
                <th className="p-8 text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground">Pedido</th>
                <th className="p-8 text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground">Cliente</th>
                <th className="p-8 text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground">Data</th>
                <th className="p-8 text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground">Total</th>
                <th className="p-8 text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground">Status</th>
                <th className="p-8 text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground text-right">Rastreio / Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="group border-b border-border/10 hover:bg-white/[0.02] transition-colors">
                  <td className="p-8">
                    <span className="font-mono text-[10px] font-bold text-primary">#{order.id.split('-')[0].toUpperCase()}</span>
                  </td>
                  <td className="p-8">
                    <p className="font-bold text-sm">{order.user.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-medium">{order.user.email}</p>
                  </td>
                  <td className="p-8 text-xs font-medium text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-8 font-bold font-body">
                    R$ {order.total.toFixed(2)}
                  </td>
                  <td className="p-8">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tighter ${getStatusStyle(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {order.status === 'PAID' && !updatingId && (
                        <button 
                          onClick={() => setUpdatingId(order.id)}
                          className="h-10 px-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,156,59,0.2)]"
                        >
                          Inserir Rastreio
                        </button>
                      )}
                      
                      {updatingId === order.id && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                          <input 
                            type="text"
                            placeholder="CÓDIGO"
                            value={trackingCode}
                            onChange={(e) => setTrackingCode(e.target.value)}
                            className="h-10 w-32 bg-background border border-primary/40 rounded-xl px-4 text-[10px] font-bold placeholder:text-muted-foreground/30"
                          />
                          <button 
                            onClick={() => handleUpdateTracking(order.id)}
                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-white hover:scale-110"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => {setUpdatingId(null); setTrackingCode("");}}
                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/10 text-muted-foreground"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {order.trackingCode && order.status === 'SHIPPED' && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-muted/10 rounded-xl border border-border/20">
                          <span className="font-mono text-[10px] font-bold opacity-60">{order.trackingCode}</span>
                          <Truck className="h-3 w-3 text-primary" />
                        </div>
                      )}

                      <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-muted/10 text-muted-foreground hover:text-white hover:bg-muted/20 transition-all">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
