import { Lock, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
          {["Personal", "Business", "Loans", "About Us"].map((item) => (
            <button key={item} className="text-primary-foreground/90 hover:text-primary-foreground text-sm font-medium transition-colors">
              {item}
            </button>
          ))}
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
          {["Personal", "Business", "Loans", "About Us"].map((item) => (
            <button key={item} className="block w-full text-left px-6 py-3 text-primary-foreground/90 hover:bg-primary-foreground/10 text-sm">
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
