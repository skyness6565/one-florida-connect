import branchImg from "@/assets/branch.jpg";

const PromoSection = () => {
  return (
    <section className="section-padding py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-secondary font-bold text-sm tracking-wider">LIMITED TIME OFFER</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mt-2 mb-4">
            Get $300* With a Checking Account Built for You
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            For a limited time, get a $300 bonus when you open any new checking account! Experience fee-free banking with competitive interest rates, a top-rated mobile app, and the personal touch of a local Florida bank.
          </p>
          <p className="text-muted-foreground text-sm mb-8">*Select "Learn More" to see important offer details.</p>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-colors">
            Learn More
          </button>
        </div>
        <img src={branchImg} alt="One Florida Bank modern branch" className="rounded-xl shadow-lg w-full h-[350px] object-cover" />
      </div>
    </section>
  );
};

export default PromoSection;
