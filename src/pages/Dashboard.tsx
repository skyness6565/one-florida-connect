import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Bell, Home, MessageCircle, CreditCard, ArrowUpRight, ArrowDownLeft, RefreshCw, Receipt, UserPlus, FileText, BarChart3, Globe, ChevronDown, LogOut, Wallet, PiggyBank, Zap, ShieldCheck, Star, Clock } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import PinDialog from "@/components/dashboard/PinDialog";
import TransferDialog from "@/components/dashboard/TransferDialog";
import ReceiptDialog from "@/components/dashboard/ReceiptDialog";
import TransactionHistory from "@/components/dashboard/TransactionHistory";
import BeneficiaryDialog from "@/components/dashboard/BeneficiaryDialog";
import PayBillsDialog from "@/components/dashboard/PayBillsDialog";
import BuyCryptoDialog from "@/components/dashboard/BuyCryptoDialog";
import StatementsDialog from "@/components/dashboard/StatementsDialog";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import LoansDialog from "@/components/dashboard/LoansDialog";
import InvestmentsDialog from "@/components/dashboard/InvestmentsDialog";
import SupportDialog from "@/components/dashboard/SupportDialog";

type Profile = Tables<"profiles">;

const PIN_ACTIONS = ["wire_transfer", "local_transfer", "internal_transfer", "pay_bills", "buy_crypto"];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [showCard, setShowCard] = useState(false);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [hasPin, setHasPin] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [userId, setUserId] = useState("");
  const [statementType, setStatementType] = useState<"savings" | "checking">("checking");

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }
      setUserId(session.user.id);
      const { data } = await supabase.from("profiles").select("*").eq("user_id", session.user.id).maybeSingle();
      setProfile(data);
      const { data: pinData } = await supabase.from("user_pins").select("id").eq("user_id", session.user.id).maybeSingle();
      setHasPin(!!pinData);
      setLoading(false);
    };
    init();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => { if (!session) navigate("/login"); });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const refreshProfile = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
    setProfile(data);
  };

  const handleAction = (action: string) => {
    if (PIN_ACTIONS.includes(action) && (profile as any)?.is_blocked) {
      toast({ title: "Account Blocked", description: "Your account has been restricted from making transactions. Please contact support.", variant: "destructive" });
      return;
    }
    if (PIN_ACTIONS.includes(action)) {
      setPendingAction(action);
      setActiveDialog(hasPin ? "pin-verify" : "pin-setup");
    } else {
      setActiveDialog(action);
    }
  };

  const handlePinSuccess = () => {
    setHasPin(true);
    setActiveDialog(pendingAction);
    setPendingAction(null);
  };

  const handleTransferComplete = (txn: any) => {
    setReceiptData(txn);
    setActiveDialog(null);
    refreshProfile();
    setTimeout(() => setActiveDialog("receipt"), 300);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/"); };

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
    { icon: ArrowUpRight, label: "Wire\nTransfer", action: "wire_transfer" },
    { icon: ArrowDownLeft, label: "Local\nTransfer", action: "local_transfer" },
    { icon: RefreshCw, label: "Internal\nTransfer", action: "internal_transfer" },
    { icon: Receipt, label: "Pay\nBills", action: "pay_bills" },
    { icon: CreditCard, label: "Buy\nCrypto", action: "buy_crypto" },
    { icon: UserPlus, label: "Add\nBeneficiary", action: "add_beneficiary" },
  ];

  const menuActions = [
    { icon: FileText, label: "Savings\nStatement", action: "savings_statement" },
    { icon: FileText, label: "Checking\nStatement", action: "checking_statement" },
    { icon: Bell, label: "Bank\nAlerts", action: "alerts" },
    { icon: Wallet, label: "Bank\nLoans", action: "loans" },
    { icon: BarChart3, label: "Bank\nInvestments", action: "investments" },
    { icon: MessageCircle, label: "Bank\nSupport", action: "support" },
  ];

  const tips = [
    { icon: PiggyBank, title: "Auto Save", desc: "Set a goal, save automatically with One Florida Bank's Auto Save." },
    { icon: Wallet, title: "Budget", desc: "Check in with your budget and stay on top of spending." },
    { icon: Home, title: "Home Option", desc: "Your home purchase, refinance and insights under one roof." },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2"><Globe className="w-4 h-4" /><span className="text-sm">English</span></div>
        <div className="font-heading font-bold text-lg tracking-wide">ONE FLORIDA<span className="text-[hsl(var(--bank-gold))]">.</span></div>
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

      <main className="flex-1 overflow-y-auto pb-20">
        {activeTab === "home" && (
          <>
            {/* Account Cards */}
            <div className="px-4 pt-4 space-y-3">
              <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-5 text-primary-foreground">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-primary-foreground/70 text-xs font-bold tracking-wider">CHECKING ACCOUNT</p>
                    <p className="text-3xl font-bold mt-1">${(profile?.checking_balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary-foreground/70 text-xs">ACCOUNT NUMBER</p>
                    <p className="font-mono text-sm">•••• {profile?.account_number?.slice(-4) || "0000"}</p>
                  </div>
                </div>
              </div>
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
                {quickActions.map(({ icon: Icon, label, action }) => (
                  <button key={action} onClick={() => handleAction(action)} className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="text-xs text-foreground font-medium text-center whitespace-pre-line leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-border mx-4 my-6" />

            {/* Menu Actions */}
            <div className="px-4">
              <div className="grid grid-cols-3 gap-4">
                {menuActions.map(({ icon: Icon, label, action }) => (
                  <button key={action} onClick={() => {
                    if (action === "savings_statement") { setStatementType("savings"); setActiveDialog("statement"); }
                    else if (action === "checking_statement") { setStatementType("checking"); setActiveDialog("statement"); }
                    else handleAction(action);
                  }} className="flex flex-col items-center gap-2 group">
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
              <button onClick={() => setShowCard(!showCard)} className="text-primary font-bold text-sm flex items-center gap-1">
                One Florida Cards <ChevronDown className={`w-4 h-4 transition-transform ${showCard ? "rotate-180" : ""}`} />
              </button>
              {showCard && (
                <div className="mt-3 bg-gradient-to-br from-foreground via-foreground/95 to-foreground/80 rounded-2xl p-6 text-background relative overflow-hidden">
                  <div className="w-10 h-7 bg-[hsl(var(--bank-gold))] rounded-md mb-6 flex items-center justify-center">
                    <div className="grid grid-cols-3 grid-rows-3 gap-px w-6 h-5">
                      {Array.from({ length: 9 }).map((_, i) => <div key={i} className="bg-[hsl(var(--bank-gold))]/80 rounded-[1px]" />)}
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 text-right">
                    <span className="font-heading font-bold text-lg text-primary">ONE FLORIDA<span className="text-[hsl(var(--bank-gold))]">.</span></span>
                  </div>
                  <p className="font-mono text-xl tracking-[0.2em] mb-6">{formatCardNumber(profile?.card_number)}</p>
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
                      <div className="flex mt-1 justify-end">
                        <div className="w-6 h-6 rounded-full bg-destructive/90" />
                        <div className="w-6 h-6 rounded-full bg-[hsl(var(--bank-gold))] -ml-2" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="px-4 mt-8">
              <p className="text-primary font-bold text-sm mb-4">One Florida Tips</p>
              <div className="space-y-1">
                {tips.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4 py-4 border-b border-border last:border-0">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0"><Icon className="w-6 h-6 text-secondary" /></div>
                    <div><p className="font-bold text-sm text-foreground">{title}</p><p className="text-muted-foreground text-sm mt-0.5">{desc}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 mt-8 mb-4">
              <button onClick={handleLogout} className="flex items-center gap-2 text-destructive text-sm font-medium hover:underline">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </>
        )}

        {activeTab === "history" && (
          <TransactionHistory userId={userId} onViewReceipt={(txn) => { setReceiptData(txn); setActiveDialog("receipt"); }} />
        )}

        {activeTab === "cards" && (
          <div className="px-4 pt-4">
            <div className="bg-gradient-to-br from-foreground via-foreground/95 to-foreground/80 rounded-2xl p-6 text-background relative overflow-hidden">
              <div className="w-10 h-7 bg-[hsl(var(--bank-gold))] rounded-md mb-6 flex items-center justify-center">
                <div className="grid grid-cols-3 grid-rows-3 gap-px w-6 h-5">
                  {Array.from({ length: 9 }).map((_, i) => <div key={i} className="bg-[hsl(var(--bank-gold))]/80 rounded-[1px]" />)}
                </div>
              </div>
              <div className="absolute top-6 right-6"><span className="font-heading font-bold text-lg text-primary">ONE FLORIDA<span className="text-[hsl(var(--bank-gold))]">.</span></span></div>
              <p className="font-mono text-xl tracking-[0.2em] mb-6">{formatCardNumber(profile?.card_number)}</p>
              <div className="flex justify-between items-end">
                <div><p className="text-background/50 text-[10px] tracking-wider">CARD HOLDER</p><p className="font-semibold text-sm uppercase">{profile?.full_name || profile?.username}</p></div>
                <div className="text-center"><p className="text-background/50 text-[10px] tracking-wider">CVV</p><p className="font-mono font-semibold text-sm">{profile?.card_cvv || "***"}</p></div>
                <div className="text-right"><p className="text-background/50 text-[10px] tracking-wider">VALID THRU</p><p className="font-semibold text-sm">12/28</p></div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex items-center justify-around py-2 z-50">
        {[
          { icon: Home, label: "Home", key: "home" },
          { icon: Clock, label: "History", key: "history" },
          { icon: CreditCard, label: "Cards", key: "cards" },
          { icon: Bell, label: "Alerts", key: "alerts_tab" },
          { icon: Settings, label: "Settings", key: "settings" },
        ].map(({ icon: Icon, label, key }) => (
          <button key={key} onClick={() => {
            if (key === "alerts_tab") setActiveDialog("alerts");
            else if (key === "settings") handleLogout();
            else setActiveTab(key);
          }} className={`flex flex-col items-center gap-1 px-3 py-1 ${activeTab === key ? "text-primary" : "text-muted-foreground"}`}>
            <Icon className="w-5 h-5" /><span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </nav>

      {/* All Dialogs */}
      <PinDialog open={activeDialog === "pin-setup" || activeDialog === "pin-verify"} mode={activeDialog === "pin-setup" ? "setup" : "verify"} userId={userId} onSuccess={handlePinSuccess} onClose={() => { setActiveDialog(null); setPendingAction(null); }} />

      {(activeDialog === "wire_transfer" || activeDialog === "local_transfer" || activeDialog === "internal_transfer") && profile && (
        <TransferDialog open type={activeDialog as any} profile={profile} userId={userId} onComplete={handleTransferComplete} onClose={() => setActiveDialog(null)} />
      )}

      <ReceiptDialog open={activeDialog === "receipt"} transaction={receiptData} onClose={() => setActiveDialog(null)} />
      <BeneficiaryDialog open={activeDialog === "add_beneficiary"} onClose={() => setActiveDialog(null)} userId={userId} />

      {activeDialog === "pay_bills" && profile && (
        <PayBillsDialog open onClose={() => setActiveDialog(null)} userId={userId} profile={profile} onComplete={handleTransferComplete} />
      )}

      {activeDialog === "buy_crypto" && profile && (
        <BuyCryptoDialog open onClose={() => setActiveDialog(null)} userId={userId} profile={profile} onComplete={handleTransferComplete} />
      )}

      <StatementsDialog open={activeDialog === "statement"} onClose={() => setActiveDialog(null)} userId={userId} type={statementType} />
      <AlertsPanel open={activeDialog === "alerts"} onClose={() => setActiveDialog(null)} userId={userId} />
      <LoansDialog open={activeDialog === "loans"} onClose={() => setActiveDialog(null)} userId={userId} />

      {activeDialog === "investments" && profile && (
        <InvestmentsDialog open onClose={() => setActiveDialog(null)} userId={userId} profile={profile} />
      )}

      <SupportDialog open={activeDialog === "support"} onClose={() => setActiveDialog(null)} userId={userId} />
    </div>
  );
};

export default Dashboard;
