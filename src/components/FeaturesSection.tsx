import { Shield, Activity, Lock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Transactions",
    desc: "Every payment is protected with industry-leading encryption. Safe as the trusted standard of banking.",
  },
  {
    icon: Activity,
    title: "Real-Time Monitoring",
    desc: "Access real-time updates on all your transactions. Stay on top of account activity in seconds.",
  },
  {
    icon: Lock,
    title: "Advanced Protection",
    desc: "Professional-grade security ensures your sensitive data, credentials, passwords, and assets remain safe.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="section-padding">
        <div className="grid md:grid-cols-3 gap-10">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center group">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-9 h-9 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3 text-foreground">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
