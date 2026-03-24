"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { NAV_LINKS } from "@/types";

const Navbar = () => {
  const { totalItems } = useCart();

  return (
    <nav className="absolute top-0 left-0 right-0 z-20 py-6">
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-2xl font-semibold text-primary-foreground tracking-wide"
        >
          Vitta
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-sans text-sm tracking-wider uppercase text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Ícone do carrinho */}
        <Link
          href="/carrinho"
          aria-label="Ir para o carrinho"
          className="relative flex items-center text-primary-foreground/80 hover:text-primary-foreground transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
