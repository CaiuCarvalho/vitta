"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-max section-padding text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              Lançamento — Frete grátis acima de R$150
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            O Padrão Único do
            <br />
            <span className="gradient-text">Verdadeiro Luxo</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-surface-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Descubra coleções exclusivas e produtos criteriosamente selecionados para 
            elevar o seu dia a dia. Experiências incomparáveis para pessoas exigentes.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#produtos"
              className="px-8 py-4 text-base font-semibold rounded-full gradient-bg text-white hover:opacity-90 transition-all shadow-glow hover:shadow-glow-lg"
            >
              Ver Produtos
            </a>
            <a
              href="#categorias"
              className="px-8 py-4 text-base font-semibold rounded-full border-2 border-surface-200 dark:border-surface-700 text-foreground hover:border-primary-500 hover:text-primary-600 transition-all"
            >
              Explorar Categorias
            </a>
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-surface-400"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 border-2 border-background flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span>+2.500 clientes satisfeitos</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1">4.9/5 avaliação média</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
