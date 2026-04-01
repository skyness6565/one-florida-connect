import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="section-padding py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-foreground/10 border-2 border-primary-foreground/30 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-heading font-bold text-primary-foreground text-lg leading-none block">Onprofitunity</span>
                <span className="text-primary-foreground/60 text-[10px] tracking-[0.2em]">BANKING</span>
              </div>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Banking Built on Trust. Your secure partner in financial success since 2021.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-sm tracking-wider mb-4">QUICK LINKS</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">Home</a></li>
              <li><a href="#services" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">Services</a></li>
              <li><a href="#security" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">Security</a></li>
              <li><a href="#about" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">About</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-bold text-sm tracking-wider mb-4">SERVICES</h3>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">Open Account</Link></li>
              <li><Link to="/login" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">Online Banking</Link></li>
              <li><a href="#" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">Loans</a></li>
              <li><a href="#" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">Investments</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-sm tracking-wider mb-4">CONTACT US</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary-foreground/50 mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/60 text-sm">1425 Brickell Ave, Suite 800, Miami, FL 33131</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-foreground/50 flex-shrink-0" />
                <a href="https://wa.me/14752659996" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">+1 (475) 265-9996</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-foreground/50 flex-shrink-0" />
                <a href="mailto:gazinggsunn@gmail.com" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">gazinggsunn@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/40 text-sm">© 2021 Onprofitunity. All rights reserved. Member FDIC. Equal Housing Lender.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
