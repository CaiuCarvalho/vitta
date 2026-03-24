"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

// Produto mock — futuramente virá da API/DB
const productMock: Product = {
  id: "prod-001",
  name: "Sérum Reparador Premium",
  price: 189.9,
  rating: 4.8,
  reviews: 124,
  description:
    "Óleo concentrado que sela as cutículas e devolve o brilho natural aos fios danificados. Absorção ultra-rápida, sem residuos, com perfume floral exclusivo.",
  features: [
    "Sela cutículas danificadas",
    "Brilho intenso desde a 1ª aplicação",
    "Absorção ultra-rápida",
    "Fragrância exclusiva",
  ],
  image_url: "/images/product-serum.jpg",
  category: "Sérum",
};

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: productMock.id,
        name: productMock.name,
        price: productMock.price,
        image_url: productMock.image_url,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-transparent">
        <div className="container mx-auto px-6 md:px-12">
          {/* Breadcrumbs */}
          <nav className="flex text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <span className="mx-1">/</span>
              </li>
              <li>
                <Link href="/#produtos" className="hover:text-primary transition-colors">
                  {productMock.category}
                </Link>
              </li>
              <li aria-hidden="true">
                <span className="mx-1">/</span>
              </li>
              <li aria-current="page">
                <span className="text-foreground truncate max-w-[200px] inline-block align-bottom">
                  {productMock.name}
                </span>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Esquerda: Imagem */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-card rounded-3xl aspect-square flex items-center justify-center border border-border shadow-md">
                <div className="w-40 h-40 rounded-2xl bg-rose-soft flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-20 h-20 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Direita: Informações */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col justify-center"
            >
              {/* Avaliação */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400" aria-label={`Avaliação: ${productMock.rating} de 5`}>
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(productMock.rating) ? "fill-current" : "text-muted fill-muted"}`}
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">{productMock.rating}</span>
                <span className="text-sm text-muted-foreground">({productMock.reviews} avaliações)</span>
              </div>

              {/* Título e Preço */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4 leading-tight">
                {productMock.name}
              </h1>
              <p className="text-4xl font-black text-gold mb-6">
                {formatCurrency(productMock.price)}
              </p>

              {/* Descrição */}
              <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                {productMock.description}
              </p>

              {/* Features */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {productMock.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Quantidade + CTA */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex items-center justify-between border-2 border-border bg-card rounded-full px-4 py-3 sm:w-32">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                    aria-label="Diminuir quantidade"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="font-semibold text-foreground select-none">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                    aria-label="Aumentar quantidade"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 text-base font-bold rounded-full transition-all shadow-md hover:shadow-lg ${
                    added
                      ? "bg-green-600 text-white"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                >
                  {added ? (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Adicionado!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                      </svg>
                      Adicionar ao Carrinho
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <span>Envio rápido e seguro para todo o Brasil.</span>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
