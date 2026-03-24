import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import HeroSection from "@/components/HeroSection";

// Mock do next/image para evitar erros em ambiente de teste
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === "string" ? src : ""} alt={alt} />
  ),
}));

// Mock dos assets de imagem
vi.mock("@/assets/hero-hair.jpg", () => ({
  default: { src: "/mock-hero.jpg", height: 600, width: 1200 },
}));

describe("HeroSection", () => {
  test("renderiza o título principal", () => {
    render(<HeroSection />);
    expect(
      screen.getByText("Seu cabelo merece o extraordinário"),
    ).toBeInTheDocument();
  });

  test("renderiza o subtítulo com a proposta de valor", () => {
    render(<HeroSection />);
    expect(screen.getByText("Cuidados Capilares Premium")).toBeInTheDocument();
  });

  test("renderiza os dois CTAs principais", () => {
    render(<HeroSection />);
    expect(screen.getByText("Explorar Produtos")).toBeInTheDocument();
    expect(screen.getByText("Nossa História")).toBeInTheDocument();
  });

  test("o link 'Explorar Produtos' aponta para #produtos", () => {
    render(<HeroSection />);
    const link = screen.getByText("Explorar Produtos").closest("a");
    expect(link).toHaveAttribute("href", "#produtos");
  });

  test("o link 'Nossa História' aponta para #sobre", () => {
    render(<HeroSection />);
    const link = screen.getByText("Nossa História").closest("a");
    expect(link).toHaveAttribute("href", "#sobre");
  });

  test("a imagem hero possui alt text acessível", () => {
    render(<HeroSection />);
    expect(screen.getByAltText("Luxo e cuidado capilar")).toBeInTheDocument();
  });
});

describe("HeroSection — interação", () => {
  test("links são clicáveis (sem navegação real em teste)", async () => {
    const user = userEvent.setup();
    render(<HeroSection />);
    const link = screen.getByText("Explorar Produtos");
    // Clicar não deve lançar erro
    await user.click(link);
    expect(link).toBeInTheDocument();
  });
});
