import { useState } from "react";

const testimonials = [
  { text: "I am impressed with the customer service and speed of payout. One Florida Bank truly cares about their customers.", name: "Ralph Morris" },
  { text: "Switching to One Florida Bank was the best financial decision I've made. Their rates are unbeatable and the mobile app is fantastic.", name: "Maria Santos" },
  { text: "The team helped me secure a mortgage with incredible terms. They walked me through every step of the process.", name: "James Thompson" },
];

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="py-20">
      <div className="section-padding text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-heading italic text-secondary mb-10">
          Hear From Our Customers
        </h2>
        <p className="text-lg text-foreground mb-4">"{testimonials[active].text}"</p>
        <p className="font-heading italic text-secondary mt-6">{testimonials[active].name}</p>
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-3 h-3 rounded-full transition-colors ${i === active ? "bg-secondary" : "bg-border"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
