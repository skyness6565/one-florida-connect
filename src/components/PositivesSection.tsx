import { CheckCircle, TrendingUp, Heart, Users, Award, Leaf } from "lucide-react";

const positives = [
  { icon: CheckCircle, title: "No Hidden Fees", desc: "Transparent banking with no surprise charges. What you see is what you get — always." },
  { icon: TrendingUp, title: "Competitive Rates", desc: "Earn more on your savings with rates that consistently outperform national averages." },
  { icon: Heart, title: "Community Focused", desc: "For over 80 years, we've reinvested in communities, supporting local businesses and families." },
  { icon: Users, title: "Personalized Service", desc: "Dedicated relationship managers who know your name and understand your financial goals." },
  { icon: Award, title: "Award-Winning App", desc: "Manage your money anytime with our top-rated mobile banking app — voted #1 nationwide." },
  { icon: Leaf, title: "Sustainable Banking", desc: "We're committed to green initiatives, paperless statements, and environmentally responsible practices." },
];

const PositivesSection = () => {
  return (
    <section className="py-20">
      <div className="section-padding">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">
          Why Choose Onprofitunity?
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 text-lg">
          We're not just another bank. We're your neighbors, your partners, and your biggest advocates for financial success.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {positives.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center p-6 group">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PositivesSection;
