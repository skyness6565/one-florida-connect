const Footer = () => {
  const columns = [
    { title: "ABOUT ONE FLORIDA", links: ["Who We Are", "Contact Us", "Careers", "Press Room"] },
    { title: "NEWS & EVENTS", links: ["Latest News", "Community Events", "Financial Tips"] },
    { title: "CAREERS", links: ["Get Started", "Current Openings", "Benefits"] },
    { title: "GIVING BACK", links: ["One Florida Foundation", "Community Partners", "Volunteer"] },
  ];

  return (
    <footer>
      <div className="bank-gradient py-20">
        <div className="section-padding">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center text-primary-foreground mb-4">
            Building Strength Together
          </h2>
          <p className="text-primary-foreground/80 text-center max-w-3xl mx-auto leading-relaxed mb-16">
            One Florida Bank is a community bank built on the unshakeable promise to serve those who work every day to build a better future for us all. For over 80 years, we've delivered a breadth of financial services, expert guidance, and innovative tools to help strengthen and grow businesses, families, and our local communities. We are your bank, and we are Building Strength Together.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-secondary font-bold text-sm tracking-wider mb-4">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
            <p className="text-primary-foreground/50 text-sm">© 2026 One Florida Bank. All rights reserved. Member FDIC. Equal Housing Lender.</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-foreground">
        <div className="section-padding flex justify-between items-center py-4">
          <a href="/login" className="text-background font-bold hover:text-secondary transition-colors">Login</a>
          <a href="/register" className="text-background font-bold hover:text-secondary transition-colors">Open Account</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
