"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin" },
  { label: "Produtos", icon: Package, href: "/admin/products" },
  { label: "Pedidos", icon: ShoppingBag, href: "/admin/orders" },
  { label: "Clientes", icon: Users, href: "/admin/users" },
  { label: "Ajustes", icon: Settings, href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Guard: Somente ADMIN pode acessar
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login?redirect=" + pathname);
      } else if (user?.role !== "ADMIN") {
        router.push("/");
      }
    }
  }, [isLoading, isAuthenticated, user, router, pathname]);

  if (isLoading || !isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#020202] text-foreground font-body overflow-x-hidden">
      {/* Background Orbs for Depth */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

      {/* Sidebar Desktop */}
      <aside 
        className={`fixed left-0 top-0 z-50 h-full bg-[#050505]/40 backdrop-blur-2xl border-r border-white/5 transition-all duration-500 ease-in-out ${
          isSidebarOpen ? "w-72" : "w-20"
        } hidden md:flex flex-col shadow-[1px_0_0_0_rgba(255,255,255,0.05)]`}
      >
        <div className="p-8 flex items-center justify-between overflow-hidden">
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Logo className="text-xl" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-1 block">Elite Admin</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground"
          >
            {isSidebarOpen ? <ChevronRight className="rotate-180 h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(0,156,59,0.2)]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`} />
                {isSidebarOpen && (
                  <span className="font-display uppercase tracking-wider text-xs font-bold leading-none">
                    {item.label}
                  </span>
                )}
                {isActive && isSidebarOpen && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-border/10">
          <button className="flex items-center gap-4 w-full p-4 rounded-2xl text-muted-foreground hover:text-red-400 hover:bg-red-400/5 transition-all transition-all duration-300">
            <LogOut className="h-5 w-5 shrink-0" />
            {isSidebarOpen && <span className="font-display uppercase tracking-wider text-xs font-bold">Encerrar Sessão</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={`flex-1 transition-all duration-500 ease-in-out ${
          isSidebarOpen ? "md:ml-72" : "md:ml-20"
        } min-h-screen relative`}
      >
        {/* Top Header Mockup (Mobile only) */}
        <header className="md:hidden flex items-center justify-between p-6 border-b border-border/40 bg-card/10 backdrop-blur-md">
          <Logo className="text-xl" />
          <button className="p-2 bg-muted/40 rounded-xl">
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* Content Wrap */}
        <div className="p-8 md:p-12 max-w-7xl mx-auto">
          {children}
        </div>

        {/* Branding decoration */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none" />
      </main>
    </div>
  );
}
