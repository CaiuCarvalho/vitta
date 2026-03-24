"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

// ============================================================
// Schema de validação
// ============================================================

const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(100)
    .refine((s) => !/<>/.test(s), "Caracteres de script não permitidos."),
  email: z.string().trim().email("E-mail inválido."),
  cep: z
    .string()
    .trim()
    .regex(/^\d{5}-?\d{3}$/, "CEP inválido. Ex: 12345-678"),
  street: z
    .string()
    .trim()
    .min(5, "O logradouro deve ter pelo menos 5 caracteres.")
    .refine((s) => !/<>/.test(s), "Caracteres de script não permitidos."),
  number: z.string().trim().min(1, "O número é obrigatório."),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

// ============================================================
// Componente auxiliar: campo de formulário
// ============================================================

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50";

interface FieldError {
  message?: string;
}
interface FormFieldProps {
  id: string;
  label: string;
  error?: FieldError;
  children: React.ReactNode;
}

function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-1">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-destructive text-sm mt-1 font-medium">{error.message}</p>
      )}
    </div>
  );
}

// ============================================================
// Componente auxiliar: cabeçalho de etapa
// ============================================================

function StepHeader({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
        {step}
      </div>
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
    </div>
  );
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

// ============================================================
// Página de Checkout
// ============================================================

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const shipping = subtotal > 150 ? 0 : 25.0;
  const total = subtotal + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      cep: "",
      street: "",
      number: "",
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Dados enviados ao backend:", data);
    toast.success("Pedido confirmado com sucesso!", {
      description: "Seus dados foram validados e o pedido está em processamento.",
    });
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      {/* Header */}
      <header className="py-6 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-semibold text-foreground tracking-wide">
            Vitta
          </Link>
          <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
            </svg>
            Checkout Seguro
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-6 md:px-12 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            {/* Formulário */}
            <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7 space-y-10">
              {/* Dados de Contato */}
              <section>
                <StepHeader step={1} title="Dados de Contato" />
                <div className="space-y-4 p-8 bg-card rounded-3xl border border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField id="fullName" label="Nome Completo" error={errors.fullName}>
                      <input
                        id="fullName"
                        {...register("fullName")}
                        type="text"
                        className={inputClass}
                        placeholder="Maria Silva"
                        disabled={isSubmitting}
                      />
                    </FormField>
                    <FormField id="email" label="E-mail" error={errors.email}>
                      <input
                        id="email"
                        {...register("email")}
                        type="email"
                        className={inputClass}
                        placeholder="maria@example.com"
                        disabled={isSubmitting}
                      />
                    </FormField>
                  </div>
                </div>
              </section>

              {/* Endereço de Entrega */}
              <section>
                <StepHeader step={2} title="Endereço de Entrega" />
                <div className="space-y-4 p-8 bg-card rounded-3xl border border-border">
                  <FormField id="cep" label="CEP" error={errors.cep}>
                    <input
                      id="cep"
                      {...register("cep")}
                      type="text"
                      className={`${inputClass} md:w-1/2`}
                      placeholder="00000-000"
                      disabled={isSubmitting}
                    />
                  </FormField>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <FormField id="street" label="Logradouro / Rua" error={errors.street}>
                        <input
                          id="street"
                          {...register("street")}
                          type="text"
                          className={inputClass}
                          placeholder="Rua das Flores"
                          disabled={isSubmitting}
                        />
                      </FormField>
                    </div>
                    <FormField id="number" label="Número" error={errors.number}>
                      <input
                        id="number"
                        {...register("number")}
                        type="text"
                        className={inputClass}
                        placeholder="123"
                        disabled={isSubmitting}
                      />
                    </FormField>
                  </div>
                </div>
              </section>

              {/* Pagamento */}
              <section>
                <StepHeader step={3} title="Pagamento" />
                <div className="p-8 bg-card rounded-3xl border border-border">
                  <div className="flex items-center justify-center py-10 border-2 border-dashed border-border rounded-2xl bg-background mb-6">
                    <p className="text-muted-foreground font-medium text-sm text-center">
                      Integração com Stripe / Mercado Pago em breve
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || items.length === 0}
                    className="w-full py-4 text-lg font-bold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processando...
                      </>
                    ) : (
                      "Confirmar Pedido — Pagamento Seguro"
                    )}
                  </button>
                  {items.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground mt-3">
                      Seu carrinho está vazio.{" "}
                      <Link href="/#produtos" className="text-primary underline">
                        Adicione produtos
                      </Link>
                      .
                    </p>
                  )}
                </div>
              </section>
            </form>

            {/* Resumo da Compra */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="p-8 bg-card rounded-3xl border border-border sticky top-8">
                <h3 className="text-lg font-bold text-foreground mb-6">Detalhes da Compra</h3>

                {items.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Nenhum item no carrinho.</p>
                ) : (
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-rose-soft shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-foreground line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-foreground shrink-0">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-border pt-6 space-y-3">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Frete</span>
                    {shipping === 0 ? (
                      <span className="font-bold text-primary">Grátis</span>
                    ) : (
                      <span className="font-medium text-foreground">{formatCurrency(shipping)}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-base font-bold text-foreground">Total</span>
                    <span className="text-2xl font-black text-gold">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
