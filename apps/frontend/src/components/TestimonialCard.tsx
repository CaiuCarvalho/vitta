"use client";

import { motion } from "framer-motion";

interface TestimonialCardProps {
  name: string;
  text: string;
  rating: number;
  index?: number;
}

export default function TestimonialCard({
  name,
  text,
  rating,
  index = 0,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="p-8 rounded-3xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:shadow-card-hover transition-shadow duration-300"
    >
      {/* Stars */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${
              i < rating
                ? "text-yellow-400 fill-current"
                : "text-surface-300 dark:text-surface-600"
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p className="text-foreground leading-relaxed mb-6">
        &ldquo;{text}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="text-xs text-surface-400">Cliente verificado</p>
        </div>
      </div>
    </motion.div>
  );
}
