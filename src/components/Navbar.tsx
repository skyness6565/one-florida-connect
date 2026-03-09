import { Lock, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const aboutItems = [
    { label: "Our Mission", desc: "Empowering Florida families for over 80 years" },
    { label: "Community Impact", desc: "Reinvesting in local neighborhoods and businesses" },
    { label: "Award-Winning Service", desc: "Voted #1 community bank in Florida" },
    { label: "Financial Education", desc: "Free workshops and resources for every stage of life" },
    { label: "Sustainability", desc: "Committed to green banking and a better tomorrow" },
  ];

  return (
    <nav className="bg-primary sticky top-0 z-50">
      <div className="section-padding flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-bank-gold rounded-lg flex items-center justify-center font-heading font-bold text-primary text-lg">
            OF
          </div>
          <div>
            <span className="font-heading font-bold text-primary-foreground text-lg leading-none block">ONE FLORIDA</span>
            <span className="text-primary-foreground/70 text-xs tracking-widest">BANK</span>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/register" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
            Register
          </Link>
          <Link to="/login" className="border border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground text-sm font-medium px-5 py-2 rounded-lg transition-colors">
            Login
          </Link>
          <div className="relative">
            <button
              onClick={() => setAboutOpen(!aboutOpen)}
              className="text-primary-foreground/90 hover:text-primary-foreground text-sm font-medium transition-colors flex items-center gap-1"
            >
              About Us
              <ChevronDown className={`w-3 h-3 transition-transform ${aboutOpen ? "rotate-180" : ""}`} />
            </button>
            {aboutOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setAboutOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 bg-background rounded-xl shadow-xl border border-border z-50 py-2 overflow-hidden">
                  {aboutItems.map((item) => (
                    <a
                      key={item.label}
                      href="#"
                      className="block px-5 py-3 hover:bg-muted transition-colors"
                      onClick={() => setAboutOpen(false)}
                    >
                      <p className="font-semibold text-sm text-foreground">{item.label}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{item.desc}</p>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
            <Lock className="w-5 h-5" />
          </button>
          <div className="hidden sm:flex items-center gap-1 text-primary-foreground/90 text-sm">
            <Globe className="w-4 h-4" />
            <span>English</span>
            <ChevronDown className="w-3 h-3" />
          </div>
          <button
            className="md:hidden text-primary-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-primary-foreground/10 pb-4">
          <button className="block w-full text-left px-6 py-3 text-primary-foreground font-semibold hover:bg-primary-foreground/10 text-sm">
            Register
          </button>
          <button className="block w-full text-left px-6 py-3 text-primary-foreground/90 hover:bg-primary-foreground/10 text-sm">
            Login
          </button>
          <div className="border-t border-primary-foreground/10 mt-2 pt-2 px-6">
            <p className="text-primary-foreground/50 text-xs font-bold tracking-wider mb-2">ABOUT US</p>
            {aboutItems.map((item) => (
              <button key={item.label} className="block w-full text-left py-2 text-primary-foreground/80 hover:text-primary-foreground text-sm">
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
