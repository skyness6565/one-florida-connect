import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-bank.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <img src={heroImg} alt="Happy families at One Florida Bank" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
      <div className="relative h-full section-padding flex flex-col justify-end pb-16">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-background max-w-2xl leading-tight animate-fade-in-up">
          One Florida Bank
        </h1>
        <p className="text-background/90 text-lg md:text-xl mt-4 max-w-xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          We do banking differently. We believe that people come first, and that everyone deserves a great experience every step of the way.
        </p>
        <div className="flex gap-4 mt-8 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Link to="/register" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8 py-3 rounded-lg transition-colors">
            Open Account
          </Link>
          <Link to="/login" className="border-2 border-background text-background hover:bg-background/10 font-semibold px-8 py-3 rounded-lg transition-colors">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
