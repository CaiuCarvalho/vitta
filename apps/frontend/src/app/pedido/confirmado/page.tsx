"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  Copy,
  CreditCard,
  QrCode,
  ChevronRight,
  ShoppingBag,
  ExternalLink,
  Clock,
  Check
} from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { trackPurchase } from "@/lib/analytics";

function PedidoConfirmadoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId");
  const pixQrCode = searchParams.get("pixQrCode");
  const pixCopyPaste = searchParams.get("pixCopyPaste");
  const paymentUrl = searchParams.get("paymentUrl");
  const total = searchParams.get("total");

  const [copied, setCopied] = useState(false);

  // GA4: purchase — dispara uma única vez ao confirmar o pedido
  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    const totalValue = total ? parseFloat(total) : 0;
    trackPurchase({
      transaction_id: orderId,
      value: totalValue,
      items: [], // itens já foram enviados em begin_checkout; aqui registramos a transação
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleCopy = () => {
    if (pixCopyPaste) {
      navigator.clipboard.writeText(pixCopyPaste);
      setCopied(true);
      toast.success("Código Pix copiado!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-40 px-6 relative overflow-hidden">
      {/* Background Victory Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-[120px] scale-y-50 -translate-y-1/2" />
      </div>

      <div className="container mx-auto max-w-2xl text-center relative z-10">

        {/* Ícone de Sucesso - Tropéu Agon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 10, stiffness: 100 }}
          className="h-32 w-32 bg-gradient-to-br from-primary to-secondary rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-[0_20px_60px_rgba(0,156,59,0.4)] relative group"
        >
          <div className="absolute inset-0 bg-white/20 rounded-[2.5rem] scale-90 opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <CheckCircle2 className="h-16 w-16 text-white" />
        </motion.div>

        <header className="space-y-4 mb-16">
          <h1 className="text-5xl md:text-7xl font-display uppercase italic font-black tracking-tighter leading-none">
            VITÓRIA! <br />
            <span className="text-primary">PEDIDO RECEBIDO</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-border/40" />
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.4em]">
              ID: <span className="text-foreground">#{orderId?.split("-")[0].toUpperCase()}</span>
            </p>
            <span className="h-px w-8 bg-border/40" />
          </div>
        </header>

        <div className="space-y-10 text-left">

          {/* Seção de Pagamento PIX */}
          {pixQrCode && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card/30 backdrop-blur-xl border border-primary/30 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x" />

              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <QrCode className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-display uppercase italic font-black tracking-tight">PAGAMENTO <span className="text-primary italic">PIX</span></h2>
                </div>
                <div className="flex items-center gap-2 bg-secondary/10 text-secondary border border-secondary/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">
                  <Clock className="h-3 w-3" />
                  AGUARDANDO
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="bg-white p-3 rounded-[2rem] h-56 w-56 flex items-center justify-center shadow-2xl group-hover:scale-[1.02] transition-transform duration-500">
                  <img src={pixQrCode} alt="QR Code Pix" className="h-full w-full" />
                </div>

                <div className="flex-1 space-y-8 w-full">
                  <div className="space-y-3">
                    <p className="text-[10px] uppercase font-black text-primary tracking-[0.3em] ml-1">Copia e Cola de Elite</p>
                    <div className="relative group/copy">
                      <div className="bg-background/50 border border-border/40 rounded-2xl h-14 px-5 flex items-center overflow-hidden pr-14 text-[10px] font-mono font-bold text-muted-foreground truncate backdrop-blur-sm group-hover/copy:border-primary/50 transition-colors">
                        {pixCopyPaste}
                      </div>
                      <button
                        onClick={handleCopy}
                        className="absolute right-1.5 top-1.5 h-11 w-11 flex items-center justify-center bg-primary text-white rounded-xl hover:bg-primary/80 active:scale-90 transition-all shadow-lg"
                      >
                        {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-4">Vantagens do PIX:</p>
                    <ul className="grid grid-cols-1 gap-3">
                      <li className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-tight text-foreground/80">
                        <div className="h-5 w-5 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                          <Check className="h-3 w-3" />
                        </div>
                        Aprovação Instantânea
                      </li>
                      <li className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-tight text-foreground/80">
                        <div className="h-5 w-5 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                          <Check className="h-3 w-3" />
                        </div>
                        Prioridade no Envio Turbo
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Seção de Pagamento Cartão/Link */}
          {paymentMethodNotPix() && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card/30 backdrop-blur-xl border border-border/40 p-10 rounded-[2.5rem] shadow-2xl space-y-8 group"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-display uppercase italic font-black tracking-tight tracking-tighter">FINALIZAR <span className="text-primary italic">PAGAMENTO</span></h2>
              </div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
                Quase lá! Para garantir seu Manto Agon, clique no botão seguro abaixo e conclua a transação.
              </p>
              <a
                href={paymentUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative h-20 w-full flex items-center justify-center rounded-3xl bg-primary text-primary-foreground font-display text-2xl uppercase italic font-black tracking-[0.1em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_40px_rgba(0,156,59,0.3)]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 flex items-center gap-3">
                  IR PARA O PAGAMENTO
                  <ExternalLink className="h-6 w-6" />
                </span>
              </a>
            </motion.div>
          )}

          {/* Botões de Ação */}
          <div className="flex flex-col md:flex-row gap-6 pt-10">
            <button
              onClick={() => router.push("/")}
              className="flex-1 h-18 bg-card/20 backdrop-blur-md border border-border/40 rounded-3xl flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-[0.2em] text-foreground hover:bg-muted/10 transition-all group"
            >
              <ShoppingBag className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              Continuar Comprando
            </button>
            <button
              onClick={() => router.push("/perfil")}
              className="flex-1 h-18 bg-card/20 backdrop-blur-md border border-border/40 rounded-3xl flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-[0.2em] text-foreground hover:bg-primary/20 hover:border-primary/40 transition-all group"
            >
              Acompanhar Pedido
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );

  function paymentMethodNotPix() {
    return paymentUrl && !pixQrCode;
  }
}

export default function PedidoConfirmadoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Clock className="animate-spin text-primary" /></div>}>
      <PedidoConfirmadoContent />
    </Suspense>
  );
}
