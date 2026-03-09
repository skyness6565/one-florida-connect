import { Shield, Eye, Lock, FileCheck, UserCheck, Server } from "lucide-react";

const privacyFeatures = [
  { icon: Shield, title: "FDIC Insured", desc: "Your deposits are insured up to $250,000 by the Federal Deposit Insurance Corporation, providing you with complete peace of mind." },
  { icon: Lock, title: "256-Bit Encryption", desc: "All your data is protected with bank-grade 256-bit SSL encryption, the same security standard used by the world's leading financial institutions." },
  { icon: Eye, title: "Privacy First", desc: "We never sell your personal information to third parties. Your financial data stays between you and your bank — always." },
  { icon: FileCheck, title: "Regulatory Compliance", desc: "We comply with all federal and state banking regulations including the Gramm-Leach-Bliley Act and the Right to Financial Privacy Act." },
  { icon: UserCheck, title: "Identity Protection", desc: "Advanced multi-factor authentication and real-time fraud monitoring keep your accounts safe from unauthorized access 24/7." },
  { icon: Server, title: "Secure Data Centers", desc: "Your information is stored in SOC 2 Type II certified data centers with redundant backups, ensuring it's always safe and available." },
];

const PrivacySection = () => {
  return (
    <section className="bg-bank-gray py-20">
      <div className="section-padding">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">
          Your Security & Privacy Matter
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 text-lg">
          At One Florida Bank, protecting your personal and financial information is our highest priority. Here's how we keep you safe.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {privacyFeatures.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-background p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-secondary" />
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

export default PrivacySection;
