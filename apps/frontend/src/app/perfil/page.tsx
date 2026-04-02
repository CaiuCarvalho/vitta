"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User as UserIcon, 
  MapPin, 
  ShoppingBag, 
  ShieldCheck, 
  LogOut, 
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  ChevronRight,
  Camera,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { AddressForm } from "@/components/profile/AddressForm";
import { OrderList } from "@/components/profile/OrderList";
import { AvatarSelector } from "@/components/profile/AvatarSelector";
import { VerificationModal } from "@/components/profile/VerificationModal";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const { user, token, logout, updateUser, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // States
  const [profileData, setProfileData] = useState({ name: "", phone: "", taxId: "", avatarUrl: "" });
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Avatar Modal
  const [isAvatarSelectorOpen, setIsAvatarSelectorOpen] = useState(false);

  // Address Modals
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  // Verification Modal
  const [verificationType, setVerificationType] = useState<"EMAIL_UPDATE" | "TAXID_UPDATE" | null>(null);
  const [pendingValue, setPendingValue] = useState("");
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // Fetch Full User Data
  const fetchData = useCallback(async () => {
    if (!token || !user?.id) return;
    
    setIsDataLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://agonimports.com/api";
      
      // Get User Details
      const userRes = await fetch(`${apiUrl}/api/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await userRes.json();
      
      if (userData.data) {
        setProfileData({
          name: userData.data.name || "",
          phone: userData.data.phone || "",
          taxId: userData.data.taxId || "",
          avatarUrl: userData.data.avatarUrl || ""
        });
        setAddresses(userData.data.addresses || []);
        setOrders(userData.data.orders || []);
      }
    } catch (error) {
      toast.error("Erro ao carregar dados do perfil.");
      console.error(error);
    } finally {
      setIsDataLoading(false);
    }
  }, [token, user?.id]);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
    } else if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, isAuthLoading, router, fetchData]);

  // Handle Profile Update
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if sensitive data changed
    const userOriginal = user as any; // useAuth stores basic info
    const hasTaxIdChanged = profileData.taxId !== (userOriginal?.taxId || "");
    // Note: Email change logic would go here if we had an email field in the form
    
    if (hasTaxIdChanged) {
      setVerificationType("TAXID_UPDATE");
      setPendingValue(profileData.taxId);
      
      // Request verification token
      setIsSaving(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://agonimports.com/api";
        const res = await fetch(`${apiUrl}/api/users/${user?.id}/update-request`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ type: "TAXID_UPDATE", newValue: profileData.taxId })
        });
        
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Erro ao solicitar verificação.");
        }
        
        setIsVerificationModalOpen(true);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsSaving(false);
      }
      return;
    }

    // Regular update for non-sensitive data
    setIsSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://agonimports.com/api";
      const res = await fetch(`${apiUrl}/api/users/${user?.id}/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name: profileData.name, phone: profileData.phone, avatarUrl: profileData.avatarUrl })
      });
      
      const result = await res.json();
      if (res.ok) {
        updateUser({ name: profileData.name, avatarUrl: profileData.avatarUrl });
        toast.success("Perfil atualizado com sucesso!");
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Token Confirmation
  const handleVerifyConfirm = async (otpToken: string) => {
    setIsSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://agonimports.com/api";
      const res = await fetch(`${apiUrl}/api/users/${user?.id}/update-confirm`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ token: otpToken, type: verificationType })
      });
      
      const result = await res.json();
      if (res.ok) {
        toast.success("Informação confirmada e atualizada!");
        setIsVerificationModalOpen(false);
        fetchData();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Avatar Update
  const handleAvatarSelect = async (avatarUrl: string) => {
    setIsSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://agonimports.com/api";
      const res = await fetch(`${apiUrl}/api/users/${user?.id}/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ avatarUrl })
      });
      
      const result = await res.json();
      if (res.ok) {
        updateUser({ avatarUrl });
        setProfileData(prev => ({ ...prev, avatarUrl }));
        toast.success("Avatar atualizado com sucesso!");
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Address Handlers
  const handleSaveAddress = async (data: any) => {
    setIsSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://agonimports.com/api";
      const method = editingAddress ? "PUT" : "POST";
      const url = editingAddress 
        ? `${apiUrl}/api/users/${user?.id}/addresses/${editingAddress.id}` 
        : `${apiUrl}/api/users/${user?.id}/addresses`;
      
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        toast.success(editingAddress ? "Endereço atualizado!" : "Endereço cadastrado!");
        setIsAddressModalOpen(false);
        setEditingAddress(null);
        fetchData();
      } else {
        const err = await res.json();
        throw new Error(err.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Tem certeza que deseja excluir este endereço?")) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://agonimports.com/api";
      const res = await fetch(`${apiUrl}/api/users/${user?.id}/addresses/${addressId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        toast.success("Endereço removido.");
        fetchData();
      }
    } catch (error) {
      toast.error("Erro ao remover endereço.");
    }
  };

  if (isAuthLoading || isDataLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 md:py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          {/* Header Section */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-muted/30 shadow-2xl transition-all group-hover:border-primary/50">
                <AvatarImage src={profileData.avatarUrl} />
                <AvatarFallback className="text-3xl font-display font-black bg-muted">
                  {user?.name?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button 
                type="button"
                onClick={() => setIsAvatarSelectorOpen(true)}
                className="absolute bottom-0 right-0 h-10 w-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center border-4 border-background hover:scale-110 transition-transform shadow-lg z-20"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-display uppercase italic font-black tracking-tighter text-foreground leading-none">
                {user?.name}
              </h1>
              <p className="text-sm text-muted-foreground uppercase font-bold tracking-[0.3em] mt-2">
                Nível Elite — Membro Agon
              </p>
              <div className="flex items-center gap-3 mt-4">
                <Button variant="outline" size="sm" className="h-8 text-[9px] uppercase font-black tracking-widest border-border/40" onClick={logout}>
                  <LogOut className="h-3 w-3 mr-2" />
                  Sair do Perfil
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="perfil" className="w-full">
          <TabsList className="w-full justify-start bg-transparent h-auto p-0 gap-6 border-b border-border/20 mb-8 overflow-x-auto overflow-y-hidden">
            <TabsTrigger value="perfil" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-4 uppercase font-black tracking-[0.2em] text-[10px] sm:text-xs">
              <UserIcon className="h-4 w-4 mr-2 hidden sm:block" />
              Dados Pessoais
            </TabsTrigger>
            <TabsTrigger value="enderecos" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-4 uppercase font-black tracking-[0.2em] text-[10px] sm:text-xs">
              <MapPin className="h-4 w-4 mr-2 hidden sm:block" />
              Meus Endereços
            </TabsTrigger>
            <TabsTrigger value="pedidos" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-4 uppercase font-black tracking-[0.2em] text-[10px] sm:text-xs">
              <ShoppingBag className="h-4 w-4 mr-2 hidden sm:block" />
              Meus Pedidos
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {/* TAB: PERFIL */}
            <TabsContent value="perfil">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <Card className="bg-muted/10 border-border/40 shadow-none">
                      <CardHeader>
                        <CardTitle className="text-xl font-display uppercase tracking-widest">Editar Informações</CardTitle>
                        <CardDescription>Mantenha seus dados atualizados para uma melhor experiência.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleProfileSave} className="space-y-6">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Nome Completo</Label>
                                <Input 
                                  value={profileData.name} 
                                  onChange={e => setProfileData({...profileData, name: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">E-mail (Login)</Label>
                                <Input 
                                  value={user?.email || ""} 
                                  disabled 
                                  className="bg-muted/40 cursor-not-allowed text-muted-foreground"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Telefone / WhatsApp</Label>
                                <Input 
                                  placeholder="(11) 99999-9999"
                                  value={profileData.phone} 
                                  onChange={e => setProfileData({...profileData, phone: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">CPF (Seguro)</Label>
                                <Input 
                                  placeholder="000.000.000-00"
                                  value={profileData.taxId} 
                                  onChange={e => setProfileData({...profileData, taxId: e.target.value})}
                                />
                                {profileData.taxId !== (user as any)?.taxId && profileData.taxId.length > 0 && (
                                  <p className="text-[9px] text-primary uppercase font-black animate-pulse">
                                    Verificação por e-mail será solicitada
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button disabled={isSaving} className="w-full sm:w-auto px-12 h-12 uppercase font-black tracking-widest text-xs">
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Alterações"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-8">
                    <Card className="bg-primary/5 border-primary/20 shadow-none">
                      <CardHeader>
                        <CardTitle className="text-lg font-display uppercase tracking-widest flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-primary" />
                          Segurança
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Sua conta está protegida por criptografia de ponta a ponta. Última alteração há 30 dias.
                        </p>
                        <Button variant="outline" className="w-full uppercase font-bold tracking-widest text-[10px] border-border/40">
                          Alterar Senha
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/20 border-border/40 shadow-none">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/40">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Membro desde</p>
                            <p className="text-sm font-bold mt-1">
                              {user?.id ? "Outubro 2024" : "---"}
                            </p>
                          </div>
                          <CheckCircle2 className="h-8 w-8 text-primary/40" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* TAB: ENDEREÇOS */}
            <TabsContent value="enderecos">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-display uppercase tracking-widest">Meus Endereços</h2>
                    <p className="text-xs text-muted-foreground mt-1">Gerencie onde seus mantos Agon serão entregues.</p>
                  </div>
                  <Button onClick={() => setIsAddressModalOpen(true)} size="sm" className="font-black uppercase tracking-widest text-[10px]">
                    <Plus className="h-3 w-3 mr-2" />
                    Novo
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {addresses.map((address) => (
                    <Card key={address.id} className="relative group border-border/40 hover:border-primary/50 transition-all">
                      <CardContent className="p-6">
                        {address.isDefault && (
                          <Badge className="absolute top-4 right-4 text-[8px] uppercase font-black bg-primary/20 text-primary border-primary/20">
                            Padrão
                          </Badge>
                        )}
                        <MapPin className="h-6 w-6 text-primary mb-4" />
                        <h3 className="font-bold text-sm mb-1">{address.street}, {address.number}</h3>
                        <p className="text-xs text-muted-foreground mb-4">
                          {address.neighborhood}, {address.city} - {address.state}<br />
                          CEP: {address.zipCode}
                        </p>
                        <div className="flex items-center gap-3 pt-4 border-t border-border/20">
                          <button 
                            onClick={() => { setEditingAddress(address); setIsAddressModalOpen(true); }}
                            className="text-[10px] uppercase font-bold text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                          >
                            <Pencil className="h-3 w-3" /> Editar
                          </button>
                          <button 
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-[10px] uppercase font-bold text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" /> Remover
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {addresses.length === 0 && (
                    <div className="col-span-full border-2 border-dashed border-border/40 rounded-2xl p-12 text-center">
                      <MapPin className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">Nenhum endereço cadastrado</p>
                      <Button variant="link" onClick={() => setIsAddressModalOpen(true)} className="mt-2 uppercase font-black text-[10px] tracking-widest">
                        Cadastrar primeiro endereço
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </TabsContent>

            {/* TAB: PEDIDOS */}
            <TabsContent value="pedidos">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <div className="mb-8">
                  <h2 className="text-xl font-display uppercase tracking-widest">Histórico de Pedidos</h2>
                  <p className="text-xs text-muted-foreground mt-1">Acompanhe o status e rastreamento das suas compras.</p>
                </div>
                
                <OrderList 
                  orders={orders} 
                  onViewDetails={(order) => {
                    toast.info(`Visualizando detalhes do pedido #${order.id.slice(0, 8)}`);
                  }} 
                />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>

      {/* MODALS */}
      <AddressForm 
        isOpen={isAddressModalOpen}
        onClose={() => { setIsAddressModalOpen(false); setEditingAddress(null); }}
        onSave={handleSaveAddress}
        initialData={editingAddress}
        isLoading={isSaving}
      />

      <AvatarSelector 
        isOpen={isAvatarSelectorOpen}
        onClose={() => setIsAvatarSelectorOpen(false)}
        onSelect={handleAvatarSelect}
        currentAvatar={profileData.avatarUrl}
      />

      <VerificationModal 
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onConfirm={handleVerifyConfirm}
        type={verificationType}
        isLoading={isSaving}
      />
    </div>
  );
}
