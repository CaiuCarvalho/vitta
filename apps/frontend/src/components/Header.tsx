"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Início", href: "#" },
  { label: "Produtos", href: "#produtos" },
  { label: "Categorias", href: "#categorias" },
  { label: "Depoimentos", href: "#depoimentos" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container-max flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Vitta
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-surface-500 hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA + Cart */}
        <div className="hidden md:flex items-center gap-4">
          <button
            aria-label="Carrinho"
            className="relative p-2 text-surface-500 hover:text-foreground transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
              0
            </span>
          </button>
          <a
            href="#"
            className="px-5 py-2 text-sm font-semibold rounded-full gradient-bg text-white hover:opacity-90 transition-opacity shadow-glow"
          >
            Entrar
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          aria-label="Menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-surface-500 hover:text-foreground transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden glass"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-surface-500 hover:text-foreground hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#"
                className="mt-2 px-4 py-3 text-sm font-semibold text-center rounded-full gradient-bg text-white"
              >
                Entrar
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
