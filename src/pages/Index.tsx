import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RatesSection from "@/components/RatesSection";
import PositivesSection from "@/components/PositivesSection";
import PrivacySection from "@/components/PrivacySection";
import ContactSection from "@/components/ContactSection";
import PromoSection from "@/components/PromoSection";
import ArticlesSection from "@/components/ArticlesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <RatesSection />
      <PositivesSection />
      <PrivacySection />
      <PromoSection />
      <ContactSection />
      <ArticlesSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
