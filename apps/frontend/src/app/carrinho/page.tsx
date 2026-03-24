"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();

  const shipping = subtotal > 150 ? 0 : 25.0;
  const total = subtotal + shipping;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-transparent">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-8">
              Seu Carrinho
            </h1>

            {items.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-3xl border border-border mt-10">
                <p className="text-muted-foreground mb-6 text-lg">
                  Seu carrinho está vazio.
                </p>
                <Link
                  href="/#produtos"
                  className="inline-flex px-8 py-3 font-semibold rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Explorar Produtos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Esquerda: Lista de Itens */}
                <div className="lg:col-span-2 space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-card rounded-3xl border border-border"
                    >
                      {/* Placeholder Visual */}
                      <div className="w-24 h-24 shrink-0 rounded-2xl bg-rose-soft flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-10 h-10 text-primary"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                          />
                        </svg>
                      </div>

                      {/* Detalhes */}
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg font-bold text-foreground mb-1">
                          {item.name}
                        </h3>
                        <p className="font-semibold text-gold">
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      {/* Controles */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center justify-between border-2 border-border bg-background rounded-full px-3 py-2 w-28">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-muted-foreground hover:text-primary transition-colors"
                            aria-label="Diminuir quantidade"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="font-semibold text-sm select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-muted-foreground hover:text-primary transition-colors"
                            aria-label="Aumentar quantidade"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                          aria-label={`Remover ${item.name}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Direita: Resumo */}
                <div className="lg:col-span-1">
                  <div className="p-8 bg-card rounded-3xl border border-border sticky top-24">
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      Resumo do Pedido
                    </h2>

                    <div className="space-y-4 mb-6 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span className="font-medium text-foreground">
                          {formatCurrency(subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Frete</span>
                        <span className="font-medium text-foreground">
                          {shipping === 0 ? (
                            <span className="text-primary font-bold">Grátis</span>
                          ) : (
                            formatCurrency(shipping)
                          )}
                        </span>
                      </div>
                      {shipping > 0 && (
                        <p className="text-xs text-primary">
                          Adicione mais {formatCurrency(150 - subtotal)} para frete grátis!
                        </p>
                      )}
                    </div>

                    <div className="border-t border-border pt-6 mb-8">
                      <div className="flex justify-between items-end">
                        <span className="text-base font-semibold text-foreground">Total</span>
                        <span className="text-3xl font-black text-gold">
                          {formatCurrency(total)}
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/checkout"
                      className="w-full flex items-center justify-center py-4 text-base font-bold rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-md hover:shadow-lg"
                    >
                      Finalizar Compra
                    </Link>

                    <Link
                      href="/#produtos"
                      className="block text-center mt-4 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      Continuar comprando
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
