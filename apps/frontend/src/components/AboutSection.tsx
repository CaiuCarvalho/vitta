"use client";

import Image from "next/image";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import productsDisplay from "@/assets/products-display.jpg";

const AboutSection = () => {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section id="sobre" className="py-24 md:py-36 bg-rose-soft" ref={ref}>
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
            }`}
            style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <div className="relative overflow-hidden rounded-sm">
              <Image
                src={productsDisplay}
                alt="Nossa linha de produtos"
                className="w-full h-auto object-cover"
                placeholder="blur"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-foreground/5 rounded-sm" />
            </div>
          </div>

          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
            style={{
              transitionDelay: "150ms",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <p className="font-sans text-sm tracking-[0.25em] uppercase text-gold mb-3">
              Sobre Nós
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-[1.1] text-balance mb-6">
              Beleza que nasce do cuidado
            </h2>
            <p className="font-sans text-base text-muted-foreground leading-relaxed text-pretty mb-5">
              Nascemos da paixão por cabelos saudáveis e radiantes. Cada fórmula é desenvolvida
              com ingredientes naturais cuidadosamente selecionados, unindo ciência e tradição
              para entregar resultados visíveis desde a primeira aplicação.
            </p>
            <p className="font-sans text-base text-muted-foreground leading-relaxed text-pretty mb-8">
              Acreditamos que o autocuidado é um ritual — e seus cabelos merecem
              o que há de melhor.
            </p>

            <div className="flex gap-12">
              {[
                { number: "100%", label: "Vegano" },
                { number: "12+", label: "Produtos" },
                { number: "5mil+", label: "Clientes" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-3xl font-semibold text-primary tabular-nums">
                    {stat.number}
                  </p>
                  <p className="font-sans text-xs tracking-wider uppercase text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
