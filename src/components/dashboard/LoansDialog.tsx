import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Wallet } from "lucide-react";

interface Props { open: boolean; onClose: () => void; userId: string; }

const LoansDialog = ({ open, onClose, userId }: Props) => {
  const [loans, setLoans] = useState<any[]>([]);
  const [showApply, setShowApply] = useState(false);
  const [form, setForm] = useState({ amount: "", term_months: "12", purpose: "" });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await (supabase as any).from("loans").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    setLoans(data || []);
  };

  useEffect(() => { if (open) load(); }, [open, userId]);

  const rate = 5.5 / 100 / 12;
  const months = parseInt(form.term_months) || 12;
  const principal = parseFloat(form.amount) || 0;
  const monthly = principal > 0 ? (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1) : 0;

  const handleApply = async () => {
    if (principal < 1000) { toast({ title: "Minimum loan amount is $1,000", variant: "destructive" }); return; }
    if (principal > 500000) { toast({ title: "Maximum loan amount is $500,000", variant: "destructive" }); return; }
    setLoading(true);
    await (supabase as any).from("loans").insert({
      user_id: userId, amount: principal, term_months: months, monthly_payment: Math.round(monthly * 100) / 100, purpose: form.purpose
    });
    await (supabase as any).from("alerts").insert({
      user_id: userId, title: "Loan Application Submitted", message: `Your loan application for $${principal.toLocaleString()} has been submitted for review.`, type: "info"
    });
    toast({ title: "Loan application submitted!" });
    setForm({ amount: "", term_months: "12", purpose: "" });
    setShowApply(false);
    await load();
    setLoading(false);
  };

  const STATUS_COLORS: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", approved: "bg-green-100 text-green-700", active: "bg-blue-100 text-blue-700", paid: "bg-muted text-muted-foreground" };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Wallet className="w-5 h-5 text-primary" /> Bank Loans</DialogTitle></DialogHeader>

        {showApply ? (
          <div className="space-y-4">
            <div><Label>Loan Amount ($)</Label><Input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="10,000" /></div>
            <div>
              <Label>Term</Label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.term_months} onChange={e => setForm(p => ({ ...p, term_months: e.target.value }))}>
                <option value="6">6 months</option><option value="12">12 months</option><option value="24">24 months</option>
                <option value="36">36 months</option><option value="60">60 months</option>
              </select>
            </div>
            <div><Label>Purpose</Label><Input value={form.purpose} onChange={e => setForm(p => ({ ...p, purpose: e.target.value }))} placeholder="e.g. Home renovation" /></div>
            {principal > 0 && (
              <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
                <div className="flex justify-between"><span>Interest Rate</span><span>5.5% APR</span></div>
                <div className="flex justify-between"><span>Monthly Payment</span><span className="font-bold">${monthly.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Total Repayment</span><span>${(monthly * months).toFixed(2)}</span></div>
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowApply(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleApply} disabled={loading} className="flex-1">{loading ? "Submitting..." : "Apply"}</Button>
            </div>
          </div>
        ) : (
          <>
            <Button onClick={() => setShowApply(true)} className="w-full mb-3">Apply for Loan</Button>
            {loans.length === 0 ? <p className="text-center text-sm text-muted-foreground py-6">No loan applications</p> : (
              <div className="space-y-2">
                {loans.map((l: any) => (
                  <div key={l.id} className="p-3 bg-muted rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm">${Number(l.amount).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{l.term_months} months • ${Number(l.monthly_payment).toFixed(2)}/mo</p>
                        {l.purpose && <p className="text-xs text-muted-foreground">{l.purpose}</p>}
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[l.status] || ""}`}>{l.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoansDialog;
