"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { Loader2, ChevronRight, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { calculateShipping, UserProfile, ShippingAddress, CheckoutPayload } from "@vitta/utils";
import { trackBeginCheckout } from "@/lib/analytics";

// Sub-componentes Refatorados
import { PersonalDataForm } from "@/components/checkout/PersonalDataForm";
import { AddressSelector } from "@/components/checkout/AddressSelector";
import { OrderSummary } from "@/components/checkout/OrderSummary";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Estados do Form
  const [paymentMethod, setPaymentMethod] = useState<"PIX" | "CARD">("PIX");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  
  const [formData, setFormData] = useState({
    taxId: "",
    phone: "",
    newAddress: {
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "SP"
    } as ShippingAddress
  });

  // Cálculo de Frete Dinâmico (Sincronizado com Backend via @vitta/utils)
  const getShippingCost = () => {
    const activeZip = showNewAddressForm 
      ? formData.newAddress.zipCode
      : addresses.find(a => a.id === selectedAddressId)?.zipCode;
    
    return calculateShipping(activeZip || "", subtotal);
  };

  const shippingCost = getShippingCost();

  // 1. Guard de Autenticação e Carrinho (deps originais preservadas para evitar race condition com cart hydration)
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) router.push("/login?redirect=/checkout");
      else if (items.length === 0) {
        toast.error("Seu carrinho está vazio.");
        router.push("/cart");
      }
    }
  }, [authLoading, isAuthenticated, items.length, router]);

  // GA4: begin_checkout — dispara uma única vez quando o usuário chega ao checkout com itens
  const hasTrackedCheckout = useRef(false);
  useEffect(() => {
    if (!authLoading && isAuthenticated && items.length > 0 && !hasTrackedCheckout.current) {
      hasTrackedCheckout.current = true;
      trackBeginCheckout(
        items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity })),
        subtotal
      );
    }
  }, [authLoading, isAuthenticated, items, subtotal]);

  // 2. Carregar Perfil para Smart Checkout
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id || !token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        if (res.ok) {
          const data = result.data;
          setProfile(data);
          setAddresses(data.addresses || []);
          
          const defaultAddr = data.addresses?.find((a: ShippingAddress) => a.isDefault) || data.addresses?.[0];
          if (defaultAddr) setSelectedAddressId(defaultAddr.id);
          else setShowNewAddressForm(true);
          
          setFormData(prev => ({
            ...prev,
            taxId: data.taxId || "",
            phone: data.phone || ""
          }));
        }
      } catch {
        toast.error("Erro ao carregar dados do usuário");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchProfile();
  }, [isAuthenticated, user?.id, token]);

  const handleSubmit = async () => {
    if (items.length === 0) return;

    setSubmitting(true);
    try {
      const payload: CheckoutPayload = {
        items: items.map(i => ({ 
          productId: i.id, 
          quantity: i.quantity,
          name: i.name,
          price: i.price 
        })),
        paymentMethod,
        customer: {
          taxId: formData.taxId,
          phone: formData.phone
        },
        addressId: showNewAddressForm ? undefined : selectedAddressId,
        newAddress: showNewAddressForm ? formData.newAddress : undefined
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/checkout`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Pedido realizado!");
        clearCart();
        const params = new URLSearchParams(result.data);
        router.push(`/pedido/confirmado?${params.toString()}`);
      } else {
        toast.error(result.error || "Erro no checkout");
      }
    } catch {
      toast.error("Falha de conexão");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const isMissingPersonalData = !profile?.taxId || !profile?.phone;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-40 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Breadcrumb / Progress */}
        <div className="flex flex-wrap items-center gap-4 mb-12 text-[10px] font-black uppercase tracking-[0.3em]">
          <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" onClick={() => router.push("/cart")}>CARRINHO</span>
          <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
          <span className="text-primary italic">CHECKOUT ELITE</span>
          <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
          <span className="text-muted-foreground/40">PAGAMENTO</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-7 space-y-12">
            <header className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-display uppercase italic font-black tracking-tighter leading-none">
                FINALIZAR <br />
                <span className="text-primary">PEDIDO</span>
              </h1>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest max-w-md">
                Você está a um passo de garantir a excelência do Manto Brasileiro. Preencha os detalhes para envio.
              </p>
            </header>

            <div className="space-y-16 pt-8">
              {/* Seção 1: Dados Pessoais (Smart) */}
              <PersonalDataForm 
                userProfile={profile}
                formData={formData}
                onChange={(field, val) => setFormData(p => ({ ...p, [field]: val }))}
              />

              {/* Seção 2: Endereço */}
              <AddressSelector 
                addresses={addresses}
                selectedId={selectedAddressId}
                onSelect={setSelectedAddressId}
                showNewForm={showNewAddressForm}
                setShowNewForm={setShowNewAddressForm}
                newAddress={formData.newAddress}
                onNewAddressChange={(field, val) => setFormData(p => ({ 
                  ...p, 
                  newAddress: { ...p.newAddress, [field]: val } 
                }))}
                stepNumber={isMissingPersonalData ? 2 : 1}
              />
            </div>
          </div>

          <aside className="lg:col-span-5 sticky top-32">
            <OrderSummary 
              items={items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onSubmit={handleSubmit}
              isSubmitting={submitting}
            />

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-5 p-6 mt-10 bg-card/20 backdrop-blur-md rounded-[2rem] border border-border/30 hover:border-primary/30 transition-all duration-500 group"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-tight text-foreground">Envio Expresso Agon</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Logística de alta performance para todo o Brasil 🇧🇷</p>
              </div>
            </motion.div>
          </aside>

        </div>
      </div>
    </div>
  );
}
