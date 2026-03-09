import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { BarChart3 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const PLANS = [
  { name: "Conservative Fund", roi: 4.5, min: 500, risk: "Low" },
  { name: "Balanced Growth", roi: 7.2, min: 1000, risk: "Medium" },
  { name: "Aggressive Growth", roi: 12.5, min: 5000, risk: "High" },
  { name: "Real Estate Fund", roi: 8.8, min: 10000, risk: "Medium" },
];

interface Props { open: boolean; onClose: () => void; userId: string; profile: Profile; }

const InvestmentsDialog = ({ open, onClose, userId, profile }: Props) => {
  const [investments, setInvestments] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await (supabase as any).from("investments").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    setInvestments(data || []);
  };

  useEffect(() => { if (open) load(); }, [open, userId]);

  const totalPortfolio = investments.reduce((s: number, i: any) => s + Number(i.amount) * (1 + Number(i.roi) / 100), 0);

  const handleInvest = async () => {
    if (!selectedPlan) return;
    const amt = parseFloat(amount);
    if (amt < selectedPlan.min) { toast({ title: `Minimum investment is $${selectedPlan.min.toLocaleString()}`, variant: "destructive" }); return; }
    if (amt > (profile.checking_balance ?? 0)) { toast({ title: "Insufficient balance", variant: "destructive" }); return; }

    setLoading(true);
    const newBalance = (profile.checking_balance ?? 0) - amt;
    await supabase.from("profiles").update({ checking_balance: newBalance } as any).eq("user_id", userId);
    await (supabase as any).from("investments").insert({ user_id: userId, plan_name: selectedPlan.name, amount: amt, roi: selectedPlan.roi });
    await (supabase as any).from("transactions").insert({
      user_id: userId, transaction_id: `TXN-${Date.now().toString(36).toUpperCase()}`, type: "investment", category: "transfer",
      amount: amt, recipient_name: selectedPlan.name, status: "completed"
    });

    toast({ title: "Investment placed!" });
    setSelectedPlan(null); setAmount("");
    await load();
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" /> Investments</DialogTitle></DialogHeader>

        {investments.length > 0 && (
          <div className="bg-primary/5 p-4 rounded-xl mb-3 text-center">
            <p className="text-xs text-muted-foreground">Portfolio Value</p>
            <p className="text-2xl font-bold text-primary">${totalPortfolio.toFixed(2)}</p>
          </div>
        )}

        {selectedPlan ? (
          <div className="space-y-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedPlan(null)}>← Back</Button>
            <div className="bg-muted p-3 rounded-lg">
              <p className="font-bold">{selectedPlan.name}</p>
              <p className="text-sm text-muted-foreground">ROI: {selectedPlan.roi}% • Risk: {selectedPlan.risk} • Min: ${selectedPlan.min.toLocaleString()}</p>
            </div>
            <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={`Min $${selectedPlan.min.toLocaleString()}`} />
            <Button onClick={handleInvest} disabled={loading} className="w-full">{loading ? "Processing..." : "Invest"}</Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground mb-2">Available Plans</p>
            {PLANS.map(plan => (
              <button key={plan.name} onClick={() => setSelectedPlan(plan)} className="w-full p-4 bg-muted rounded-xl text-left hover:bg-accent transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm">{plan.name}</p>
                    <p className="text-xs text-muted-foreground">Min: ${plan.min.toLocaleString()} • Risk: {plan.risk}</p>
                  </div>
                  <span className="text-sm font-bold text-green-600">{plan.roi}% ROI</span>
                </div>
              </button>
            ))}

            {investments.length > 0 && (
              <>
                <p className="text-sm font-medium text-muted-foreground mt-4 mb-2">Your Investments</p>
                {investments.map((inv: any) => (
                  <div key={inv.id} className="p-3 bg-muted rounded-lg flex justify-between">
                    <div>
                      <p className="font-medium text-sm">{inv.plan_name}</p>
                      <p className="text-xs text-muted-foreground">Invested: ${Number(inv.amount).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-green-600">+{inv.roi}%</p>
                      <p className="text-xs">${(Number(inv.amount) * (1 + Number(inv.roi) / 100)).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentsDialog;
