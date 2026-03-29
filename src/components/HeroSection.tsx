import { Link } from "react-router-dom";
import dashboardMockup from "@/assets/dashboard-mockup.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 25% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="relative section-padding py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground leading-tight">
              Banking <span className="italic">Built on</span> Trust.
            </h1>
            <p className="text-primary-foreground/75 text-lg mt-6 max-w-lg leading-relaxed">
              Your secure partner in financial success. Experience modern banking with personalized service and cutting-edge security.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/register" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg shadow-secondary/30">
                Get Started
              </Link>
              <Link to="/login" className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8 py-3 rounded-lg transition-colors">
                Sign In
              </Link>
            </div>
          </div>

          {/* Right - Dashboard mockup */}
          <div className="animate-fade-in-up hidden md:block" style={{ animationDelay: "0.3s" }}>
            <img
              src={dashboardMockup}
              alt="One Florida Bank online banking dashboard"
              width={1024}
              height={768}
              className="w-full max-w-lg mx-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60V30C360 0 720 0 1080 30C1260 45 1440 60 1440 60H0Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
