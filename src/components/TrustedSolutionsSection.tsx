import { ShieldCheck, AlertTriangle, Eye } from "lucide-react";
import skylineImg from "@/assets/skyline.jpg";

const solutions = [
  { icon: ShieldCheck, title: "Encryption Technology" },
  { icon: AlertTriangle, title: "Fraud Protection" },
  { icon: Eye, title: "24/7 Monitoring" },
];

const TrustedSolutionsSection = () => {
  return (
    <section id="security" className="relative py-20 overflow-hidden">
      {/* Background image with overlay */}
      <img src={skylineImg} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" width={1920} height={600} />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/80" />

      <div className="relative section-padding text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-12">
          Trusted Financial Solutions
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-3xl mx-auto">
          {solutions.map(({ icon: Icon, title }) => (
            <div key={title} className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-primary-foreground/40 flex items-center justify-center">
                <Icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-heading font-bold text-primary-foreground text-lg">{title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedSolutionsSection;
