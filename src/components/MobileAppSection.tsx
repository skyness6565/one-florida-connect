import { Smartphone, Star, ShieldCheck, Zap } from "lucide-react";
import mobileImg from "@/assets/mobile-banking.jpg";

const features = [
  { icon: Zap, text: "Instant transfers & bill pay" },
  { icon: ShieldCheck, text: "Biometric login & fraud alerts" },
  { icon: Star, text: "4.8★ rated on both platforms" },
];

const MobileAppSection = () => {
  return (
    <section className="py-20 bg-bank-gray">
      <div className="section-padding">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-sm mx-auto">
              <img src={mobileImg} alt="Onprofitunity mobile app" className="w-full h-[450px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-background" />
                  <span className="text-background font-heading font-bold">Onprofitunity App</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className="text-secondary font-bold text-sm tracking-wider">MOBILE BANKING</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-2 mb-4">
              Bank Anywhere, Anytime
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Take Onprofitunity with you wherever you go. Deposit checks, transfer funds, pay bills, and monitor your accounts — all from our award-winning mobile app. Available for free on iOS and Android.
            </p>

            <div className="space-y-4 mb-10">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="text-foreground font-medium">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              {/* App Store Badge */}
              <a href="#" className="inline-flex items-center gap-3 bg-foreground hover:bg-foreground/90 text-background px-6 py-3 rounded-xl transition-colors group">
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <p className="text-background/70 text-[10px] leading-none">Download on the</p>
                  <p className="text-background font-semibold text-base leading-tight">App Store</p>
                </div>
              </a>

              {/* Google Play Badge */}
              <a href="#" className="inline-flex items-center gap-3 bg-foreground hover:bg-foreground/90 text-background px-6 py-3 rounded-xl transition-colors group">
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.1 12l2.598-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                </svg>
                <div>
                  <p className="text-background/70 text-[10px] leading-none">GET IT ON</p>
                  <p className="text-background font-semibold text-base leading-tight">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;
