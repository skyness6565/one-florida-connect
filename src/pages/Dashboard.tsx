import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Mail, Home, MessageCircle, CreditCard, ArrowUpRight, ArrowDownLeft, RefreshCw, Receipt, UserPlus, FileText, BarChart3, Globe, ChevronDown, LogOut, Wallet, PiggyBank, Zap, ShieldCheck, Star } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      setProfile(data);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/login");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const formatCardNumber = (num: string | null) => {
    if (!num) return "0000 0000 0000 0000";
    return num.replace(/(.{4})/g, "$1 ").trim();
  };

  const quickActions = [
    { icon: ArrowUpRight, label: "Wire\nTransfer", color: "bg-primary" },
    { icon: ArrowDownLeft, label: "Local\nTransfer", color: "bg-primary" },
    { icon: RefreshCw, label: "Internal\nTransfer", color: "bg-primary" },
    { icon: Receipt, label: "Pay\nBills", color: "bg-primary" },
    { icon: CreditCard, label: "Buy\nCrypto", color: "bg-primary" },
    { icon: UserPlus, label: "Add\nBeneficiary", color: "bg-primary" },
  ];

  const menuActions = [
    { icon: FileText, label: "Savings\nStatement" },
    { icon: FileText, label: "Checking\nStatement" },
    { icon: Mail, label: "Bank\nAlerts" },
    { icon: Wallet, label: "Bank\nLoans" },
    { icon: BarChart3, label: "Bank\nInvestments" },
    { icon: MessageCircle, label: "Bank\nSupport" },
  ];

  const tips = [
    { icon: PiggyBank, title: "Auto Save", desc: "Set a goal, save automatically with One Florida Bank's Auto Save and track your progress." },
    { icon: Wallet, title: "Budget", desc: "Check in with your budget and stay on top of your spending." },
    { icon: Home, title: "Home Option", desc: "Your home purchase, refinance and insights right under one roof." },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span className="text-sm">English</span>
        </div>
        <div className="font-heading font-bold text-lg tracking-wide">ONE FLORIDA<span className="text-bank-gold">.</span></div>
        <div className="flex items-center gap-2">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover border-2 border-primary-foreground/30" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs font-bold">
              {profile?.username?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {/* Account cards */}
        <div className="px-4 pt-4 space-y-3">
          {/* Checking Account */}
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-5 text-primary-foreground">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-primary-foreground/70 text-xs font-bold tracking-wider">CHECKING ACCOUNT</p>
                <p className="text-3xl font-bold mt-1">${(profile?.checking_balance ?? 14800).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="text-right">
                <p className="text-primary-foreground/70 text-xs">ACCOUNT NUMBER</p>
                <p className="font-mono text-sm">•••• {profile?.account_number || "4720"}</p>
              </div>
            </div>
          </div>

          {/* Savings Account */}
          <div className="bg-gradient-to-r from-secondary to-secondary/80 rounded-2xl p-5 text-secondary-foreground">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-secondary-foreground/70 text-xs font-bold tracking-wider">SAVINGS ACCOUNT</p>
                <p className="text-3xl font-bold mt-1">${(profile?.savings_balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="text-right">
                <p className="text-secondary-foreground/70 text-xs">INTEREST RATE</p>
                <p className="font-bold text-sm">2.5% APY</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mt-6">
          <div className="grid grid-cols-3 gap-4">
            {quickActions.map(({ icon: Icon, label, color }) => (
              <button key={label} className="flex flex-col items-center gap-2 group">
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xs text-foreground font-medium text-center whitespace-pre-line leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mx-4 my-6" />

        {/* Menu Actions */}
        <div className="px-4">
          <div className="grid grid-cols-3 gap-4">
            {menuActions.map(({ icon: Icon, label }) => (
              <button key={label} className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xs text-foreground font-medium text-center whitespace-pre-line leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Card Section */}
        <div className="px-4 mt-8">
          <button
            onClick={() => setShowCard(!showCard)}
            className="text-primary font-bold text-sm flex items-center gap-1"
          >
            One Florida Cards
            <ChevronDown className={`w-4 h-4 transition-transform ${showCard ? "rotate-180" : ""}`} />
          </button>

          {showCard && (
            <div className="mt-3 bg-gradient-to-br from-foreground via-foreground/95 to-foreground/80 rounded-2xl p-6 text-background relative overflow-hidden">
              {/* Chip */}
              <div className="w-10 h-7 bg-bank-gold rounded-md mb-6 flex items-center justify-center">
                <div className="grid grid-cols-3 grid-rows-3 gap-px w-6 h-5">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="bg-bank-gold/80 rounded-[1px]" />
                  ))}
                </div>
              </div>
              {/* Bank name */}
              <div className="absolute top-6 right-6 text-right">
                <span className="font-heading font-bold text-lg text-primary">ONE FLORIDA<span className="text-bank-gold">.</span></span>
              </div>
              {/* Card number */}
              <p className="font-mono text-xl tracking-[0.2em] mb-6">
                {formatCardNumber(profile?.card_number)}
              </p>
              {/* Bottom row */}
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-background/50 text-[10px] tracking-wider">CARD HOLDER</p>
                  <p className="font-semibold text-sm uppercase">{profile?.full_name || profile?.username || "ACCOUNT HOLDER"}</p>
                </div>
                <div className="text-center">
                  <p className="text-background/50 text-[10px] tracking-wider">CVV</p>
                  <p className="font-mono font-semibold text-sm">{profile?.card_cvv || "***"}</p>
                </div>
                <div className="text-right">
                  <p className="text-background/50 text-[10px] tracking-wider">VALID THRU</p>
                  <p className="font-semibold text-sm">12/28</p>
                  {/* Mastercard-style circles */}
                  <div className="flex gap-[-4px] mt-1 justify-end">
                    <div className="w-6 h-6 rounded-full bg-destructive/90" />
                    <div className="w-6 h-6 rounded-full bg-bank-gold -ml-2" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="px-4 mt-8">
          <p className="text-primary font-bold text-sm mb-4">One Florida Tips</p>
          <div className="space-y-1">
            {tips.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 py-4 border-b border-border last:border-0">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">{title}</p>
                  <p className="text-muted-foreground text-sm mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="px-4 mt-8 mb-4">
          <button onClick={handleLogout} className="flex items-center gap-2 text-destructive text-sm font-medium hover:underline">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex items-center justify-around py-2 z-50">
        {[
          { icon: Settings, label: "Settings", key: "settings" },
          { icon: Mail, label: "Notifications", key: "notifications" },
          { icon: Home, label: "Home", key: "home" },
          { icon: MessageCircle, label: "Support", key: "support" },
          { icon: CreditCard, label: "Cards", key: "cards" },
        ].map(({ icon: Icon, label, key }) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key);
              if (key === "cards") setShowCard(!showCard);
            }}
            className={`flex flex-col items-center gap-1 px-3 py-1 ${activeTab === key ? "text-primary" : "text-muted-foreground"}`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Dashboard;
