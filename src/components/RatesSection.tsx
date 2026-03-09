import { ChevronUp, PiggyBank, CreditCard, HandCoins, Home } from "lucide-react";
import { useState } from "react";

const rates = [
  { rate: "3.75%", type: "APY", label: "HIGH YIELD SAVINGS ACCOUNT", link: "High Yield Savings Rate" },
  { rate: "3.65%", type: "APY", label: "18 MONTH CERTIFICATE", link: "Standard Certificate Rates" },
  { rate: "4.00%", type: "APY", label: "36 MONTH CERTIFICATE", link: "Standard Certificate Rates" },
  { rate: "15.49%", type: "APR", label: "CASH REWARDS MASTERCARD", link: "Mastercard", sublabel: "AS LOW AS", note: "variable APR" },
];

const featured = [
  { icon: PiggyBank, label: "SAVINGS" },
  { icon: CreditCard, label: "CREDIT CARDS" },
  { icon: HandCoins, label: "LOANS" },
  { icon: Home, label: "MORTGAGES" },
];

const RatesSection = () => {
  const [open, setOpen] = useState(true);

  return (
    <section className="section-padding py-12">
      <div className="border border-border rounded-xl overflow-hidden shadow-lg">
        <button
          onClick={() => setOpen(!open)}
          className="w-full bank-gradient text-primary-foreground font-heading font-bold text-lg py-4 flex items-center justify-center gap-2"
        >
          RATES
          <ChevronUp className={`w-5 h-5 transition-transform ${open ? "" : "rotate-180"}`} />
        </button>

        {open && (
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="space-y-6">
              {rates.map((r, i) => (
                <div key={i}>
                  {r.sublabel && <p className="text-muted-foreground text-xs tracking-wider mb-1">{r.sublabel}</p>}
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-heading font-bold text-secondary">{r.rate}</span>
                    <span className="text-muted-foreground text-sm">{r.type}</span>
                  </div>
                  <p className="font-semibold text-sm mt-1">{r.label}</p>
                  <a href="#" className="text-secondary text-sm hover:underline">{r.link}</a>
                  {r.note && <p className="text-muted-foreground text-xs">{r.note}</p>}
                </div>
              ))}
            </div>

            <div>
              <p className="text-secondary font-heading font-bold text-center mb-6">FEATURED</p>
              <div className="grid grid-cols-2 gap-6">
                {featured.map(({ icon: Icon, label }) => (
                  <button key={label} className="flex flex-col items-center gap-3 p-6 border border-border rounded-xl hover:shadow-md hover:border-secondary/50 transition-all group cursor-pointer">
                    <div className="w-14 h-14 rounded-xl border-2 border-secondary/30 flex items-center justify-center group-hover:border-secondary transition-colors">
                      <Icon className="w-7 h-7 text-secondary" />
                    </div>
                    <span className="text-secondary text-xs font-bold tracking-wider">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RatesSection;
