import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RatesSection from "@/components/RatesSection";
import PositivesSection from "@/components/PositivesSection";
import PrivacySection from "@/components/PrivacySection";
import ContactSection from "@/components/ContactSection";
import PromoSection from "@/components/PromoSection";
import ArticlesSection from "@/components/ArticlesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import MobileAppSection from "@/components/MobileAppSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AnimatedSection><RatesSection /></AnimatedSection>
      <AnimatedSection><PositivesSection /></AnimatedSection>
      <AnimatedSection><PrivacySection /></AnimatedSection>
      <AnimatedSection><PromoSection /></AnimatedSection>
      <AnimatedSection><MobileAppSection /></AnimatedSection>
      <AnimatedSection><ContactSection /></AnimatedSection>
      <AnimatedSection><ArticlesSection /></AnimatedSection>
      <AnimatedSection><TestimonialsSection /></AnimatedSection>
      <Footer />
    </div>
  );
};

export default Index;
