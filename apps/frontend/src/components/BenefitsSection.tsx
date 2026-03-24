"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const benefits = [
  {
    title: "Ingredientes Naturais",
    description: "Extratos botânicos e óleos essenciais selecionados a dedo para nutrir cada fio.",
  },
  {
    title: "Sem Sulfatos",
    description: "Fórmulas livres de sulfatos e parabenos que preservam a saúde natural do cabelo.",
  },
  {
    title: "Resultados Visíveis",
    description: "Transformação perceptível desde a primeira aplicação, com efeito cumulativo.",
  },
  {
    title: "Cruelty-Free",
    description: "Comprometidos com a beleza ética — nenhum produto testado em animais.",
  },
];

const BenefitsSection = () => {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section className="py-24 md:py-32 bg-background" ref={ref}>
      <div className="container mx-auto px-6 md:px-12">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <p className="font-sans text-sm tracking-[0.25em] uppercase text-gold mb-3">
            Por que nos escolher
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground text-balance">
            O diferencial que seus cabelos merecem
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, i) => (
            <div
              key={benefit.title}
              className={`p-8 rounded-sm bg-card border border-border/50 transition-all duration-700 hover:shadow-md hover:shadow-foreground/5 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{
                transitionDelay: `${(i + 1) * 100}ms`,
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div className="w-10 h-10 rounded-full bg-gold-soft flex items-center justify-center mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-gold" />
              </div>
              <h3 className="font-serif text-xl font-medium text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed text-pretty">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
