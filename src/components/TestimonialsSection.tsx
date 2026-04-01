import { useState } from "react";
import { Star } from "lucide-react";

const testimonials = [
  { text: "I am impressed with the customer service and speed of payout. Onprofitunity truly cares about their customers.", name: "Ralph Morris", role: "Business Owner" },
  { text: "Switching to Onprofitunity was the best financial decision I've made. Their rates are unbeatable and the mobile app is fantastic.", name: "Maria Santos", role: "Account Holder" },
  { text: "The team helped me secure a mortgage with incredible terms. They walked me through every step of the process.", name: "James Thompson", role: "Homeowner" },
];

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="py-20 bg-background">
      <div className="section-padding text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
          What Our Clients Say
        </h2>
        <p className="text-muted-foreground mb-10">Trusted by thousands of customers across Florida</p>

        <div className="bg-muted rounded-2xl p-8 md:p-12">
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 text-bank-gold fill-bank-gold" />
            ))}
          </div>
          <p className="text-lg text-foreground leading-relaxed mb-6">"{testimonials[active].text}"</p>
          <p className="font-heading font-bold text-foreground">{testimonials[active].name}</p>
          <p className="text-muted-foreground text-sm">{testimonials[active].role}</p>
        </div>

        <div className="flex justify-center gap-3 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-3 h-3 rounded-full transition-colors ${i === active ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
