import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TrustedSolutionsSection from "@/components/TrustedSolutionsSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AnimatedSection><FeaturesSection /></AnimatedSection>
      <AnimatedSection><TrustedSolutionsSection /></AnimatedSection>
      <AnimatedSection><AboutSection /></AnimatedSection>
      <AnimatedSection><ContactSection /></AnimatedSection>
      <AnimatedSection><TestimonialsSection /></AnimatedSection>
      <Footer />
    </div>
  );
};

export default Index;
