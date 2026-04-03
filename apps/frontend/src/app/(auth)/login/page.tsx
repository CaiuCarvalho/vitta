"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { motion, AnimatePresence } from "framer-motion";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [view, setView] = useState<"login" | "register" | "forgot" | "reset">("login");
  const [resetEmail, setResetEmail] = useState("");

  // Sync state with URL params if they change
  useEffect(() => {
    const currentView = searchParams.get("view");
    if (currentView === "register") setView("register");
    else if (currentView === "forgot") setView("forgot");
    else if (currentView === "reset") setView("reset");
    else setView("login");
  }, [searchParams]);

  const updateView = (newView: "login" | "register" | "forgot" | "reset") => {
    setView(newView);
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", newView);
    router.replace(`/login?${params.toString()}`);
  };

  const getHeaderInfo = () => {
    switch (view) {
      case "register":
        return { 
          title: "CADASTRE-SE", 
          subtitle: "Junte-se à maior torcida do mundo e garanta seu manto oficial." 
        };
      case "forgot":
        return { 
          title: "RECUPERAR", 
          subtitle: "Informe seu e-mail para receber o código de acesso." 
        };
      case "reset":
        return { 
          title: "NOVA SENHA", 
          subtitle: "Crie sua nova credencial de acesso para continuar." 
        };
      default:
        return { 
          title: "BEM-VINDO", 
          subtitle: "Faça login para acessar os equipamentos de elite da torcida." 
        };
    }
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      <AnimatePresence mode="wait">
        {view === "login" && (
          <motion.div
            key="login-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <LoginForm 
              onToggleToRegister={() => updateView("register")} 
              onToggleToForgot={() => updateView("forgot")}
            />
          </motion.div>
        )}
        
        {view === "register" && (
          <motion.div
            key="register-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <RegisterForm onToggleToLogin={() => updateView("login")} />
          </motion.div>
        )}

        {view === "forgot" && (
          <motion.div
            key="forgot-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ForgotPasswordForm 
              onSuccess={(email) => {
                setResetEmail(email);
                updateView("reset");
              }} 
              onBack={() => updateView("login")} 
            />
          </motion.div>
        )}

        {view === "reset" && (
          <motion.div
            key="reset-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <ResetPasswordForm 
              email={resetEmail} 
              onBack={() => updateView("forgot")} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoginContent />
    </Suspense>
  );
}
