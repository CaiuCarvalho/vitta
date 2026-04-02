import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import Hero from "@/components/Hero";
import React from "react";

// Mock do framer-motion para evitar erros de animação em teste
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("Hero Component (Agon Theme)", () => {
  test("renderiza o slogan principal 'PELA ALMA DO HEXA'", () => {
    render(<Hero />);
    expect(screen.getByText(/PELA/i)).toBeInTheDocument();
    expect(screen.getByText(/ALMA/i)).toBeInTheDocument();
    expect(screen.getByText(/DO HEXA/i)).toBeInTheDocument();
  });

  test("renderiza o subtítulo da coleção oficial", () => {
    render(<Hero />);
    expect(screen.getByText(/Official Agon Collection 24\/25/i)).toBeInTheDocument();
  });

  test("renderiza o botão de CTA 'GARANTIR A MINHA'", () => {
    render(<Hero />);
    expect(screen.getByText(/GARANTIR A MINHA/i)).toBeInTheDocument();
  });

  test("o link do CTA aponta para a seção de produtos", () => {
    render(<Hero />);
    const link = screen.getByRole("link", { name: /GARANTIR A MINHA/i });
    expect(link).toHaveAttribute("href", "/#produtos");
  });
});
