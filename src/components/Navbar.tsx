import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Services", href: "#services" },
  { label: "Security", href: "#security" },
  { label: "About", href: "#about" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-primary sticky top-0 z-50 shadow-lg">
      <div className="section-padding flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary-foreground/10 border-2 border-primary-foreground/30 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-primary-foreground" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.83-3.13 9.37-7 10.5-3.87-1.13-7-5.67-7-10.5V6.3l7-3.12z" />
            </svg>
          </div>
          <div>
            <span className="font-heading font-bold text-primary-foreground text-lg leading-none block">Onprofitunity</span>
            <span className="text-primary-foreground/60 text-[10px] tracking-[0.2em]">BANK</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium transition-colors">
              {link.label}
            </a>
          ))}
          <Link to="/login" className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium transition-colors">
            Login
          </Link>
          <Link to="/register" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
            Open Account
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-primary-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-primary-foreground/10 pb-4 bg-primary">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="block px-6 py-3 text-primary-foreground/80 hover:bg-primary-foreground/10 text-sm" onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <Link to="/login" className="block px-6 py-3 text-primary-foreground/80 hover:bg-primary-foreground/10 text-sm" onClick={() => setMenuOpen(false)}>Login</Link>
          <div className="px-6 pt-2">
            <Link to="/register" className="block text-center bg-secondary hover:bg-secondary/90 text-secondary-foreground text-sm font-semibold px-5 py-2 rounded-lg transition-colors" onClick={() => setMenuOpen(false)}>
              Open Account
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
