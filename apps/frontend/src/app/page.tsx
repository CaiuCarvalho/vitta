import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import BenefitsSection from "@/components/BenefitsSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProductsSection />
        <BenefitsSection />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
