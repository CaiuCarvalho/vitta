import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:from-blue-600 hover:to-teal-500 shadow-lg shadow-blue-500/25",
  secondary:
    "bg-gray-800 text-white hover:bg-gray-700",
  outline:
    "border-2 border-gray-300 text-gray-700 hover:border-gray-500 dark:border-gray-600 dark:text-gray-200 dark:hover:border-gray-400",
  ghost:
    "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
};

const sizeStyles: Record<string, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
