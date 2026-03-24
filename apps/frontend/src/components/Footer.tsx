import { NAV_LINKS } from "@/types";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contato" className="py-16 bg-charcoal text-primary-foreground/70">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-primary-foreground mb-4">
              Vitta
            </h3>
            <p className="font-sans text-sm leading-relaxed text-pretty max-w-xs">
              Cuidados capilares premium para quem valoriza a beleza autêntica e o autocuidado como ritual.
            </p>
          </div>

          <div>
            <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-primary-foreground mb-4">
              Navegação
            </h4>
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="font-sans text-sm hover:text-primary-foreground transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-primary-foreground mb-4">
              Contato
            </h4>
            <div className="flex flex-col gap-3 font-sans text-sm">
              <p>contato@vitta.com.br</p>
              <p>(11) 98765-4321</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center">
          <p className="font-sans text-xs text-primary-foreground/40">
            © {currentYear} Vitta. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
