"use client";

import Image from "next/image";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import productSerum from "@/assets/product-serum.jpg";
import productMask from "@/assets/product-mask.jpg";
import productShampoo from "@/assets/product-shampoo.jpg";

const products = [
  {
    name: "Sérum Reparador",
    description: "Óleo concentrado que sela as cutículas e devolve o brilho natural aos fios danificados.",
    price: "R$ 189,90",
    image: productSerum,
  },
  {
    name: "Máscara Nutritiva",
    description: "Hidratação profunda com manteiga de karité e proteínas vegetais para cabelos sedosos.",
    price: "R$ 149,90",
    image: productMask,
  },
  {
    name: "Shampoo Revitalizante",
    description: "Limpeza suave sem sulfatos, preservando a cor e a saúde natural dos seus cabelos.",
    price: "R$ 119,90",
    image: productShampoo,
  },
];

const ProductsSection = () => {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section id="produtos" className="py-24 md:py-32 bg-background" ref={ref}>
      <div className="container mx-auto px-6 md:px-12">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <p className="font-sans text-sm tracking-[0.25em] uppercase text-gold mb-3">
            Coleção
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground text-balance">
            Nossos Produtos
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {products.map((product, i) => (
            <div
              key={product.name}
              className={`group transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{
                transitionDelay: `${(i + 1) * 120}ms`,
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div className="relative overflow-hidden rounded-sm bg-card mb-5 aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  placeholder="blur"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-foreground/5 rounded-sm pointer-events-none" />
              </div>
              <div className="px-1">
                <h3 className="font-serif text-2xl font-medium text-foreground mb-2">
                  {product.name}
                </h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed text-pretty mb-3">
                  {product.description}
                </p>
                <p className="font-sans text-base font-medium text-gold">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
