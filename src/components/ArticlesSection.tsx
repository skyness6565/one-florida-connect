import communityImg from "@/assets/community.jpg";
import mobileImg from "@/assets/mobile-banking.jpg";
import retirementImg from "@/assets/retirement.jpg";

const articles = [
  { img: communityImg, tag: "STARTING OUT", title: "Start Building Your Financial Strength", alt: "Community teamwork" },
  { img: mobileImg, tag: "DIGITAL BANKING", title: "How to Manage Your Checking Account Online", alt: "Mobile banking" },
  { img: retirementImg, tag: "PLANNING AHEAD", title: "Retirement Planning: A Guide for Every Age", alt: "Retirement planning" },
];

const ArticlesSection = () => {
  return (
    <section className="py-20 bg-bank-gray">
      <div className="section-padding">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">
          Start Building Your Financial Strength
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Tax season is quickly approaching — do you know what you need to claim? This tax checklist makes filing simple. Learn more today!
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((a) => (
            <div key={a.title} className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer">
              <img src={a.img} alt={a.alt} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-md">{a.tag}</span>
                <h3 className="text-background font-heading font-bold mt-3 text-lg leading-snug">{a.title} →</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
