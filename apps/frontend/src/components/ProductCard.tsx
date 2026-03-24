"use client";

import { motion } from "framer-motion";

interface ProductCardProps {
  name: string;
  price: number;
  description: string;
  image_url: string;
  index?: number;
}

export default function ProductCard({
  name,
  price,
  description,
  index = 0,
}: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-surface-50 dark:bg-surface-900 rounded-3xl overflow-hidden border border-surface-200 dark:border-surface-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-card-hover"
    >
      {/* Image Placeholder */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-950 dark:to-accent-950">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
              />
            </svg>
          </div>
        </div>
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-surface-500 mb-4 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold gradient-text">
            {formattedPrice}
          </span>
          <button className="px-4 py-2 text-sm font-semibold rounded-full gradient-bg text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-glow">
            Comprar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
