import Image from "next/image";
import heroImage from "@/assets/hero-hair.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Luxo e cuidado capilar"
          className="w-full h-full object-cover"
          priority
          placeholder="blur"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/40 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-24">
        <div className="max-w-xl">
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-rose-medium animate-reveal mb-6">
            Cuidados Capilares Premium
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] text-primary-foreground animate-reveal-delay-1 text-balance">
            Seu cabelo merece o extraordinário
          </h1>
          <p className="mt-6 font-sans text-base md:text-lg text-primary-foreground/80 max-w-md animate-reveal-delay-2 text-pretty leading-relaxed">
            Fórmulas exclusivas que transformam cada fio com a delicadeza e a potência que só ingredientes selecionados podem oferecer.
          </p>
          <div className="mt-10 flex gap-4 animate-reveal-delay-3">
            <a
              href="#produtos"
              className="inline-block px-8 py-3.5 bg-primary text-primary-foreground font-sans text-sm tracking-wider uppercase rounded-sm transition-shadow duration-200 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.97]"
            >
              Explorar Produtos
            </a>
            <a
              href="#sobre"
              className="inline-block px-8 py-3.5 border border-primary-foreground/30 text-primary-foreground font-sans text-sm tracking-wider uppercase rounded-sm transition-colors duration-200 hover:bg-primary-foreground/10 active:scale-[0.97]"
            >
              Nossa História
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
