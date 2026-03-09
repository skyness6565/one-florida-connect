import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Receipt, Zap, Droplets, Wifi, Tv } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const BILLS = [
  { key: "electricity", label: "Electricity", icon: Zap },
  { key: "water", label: "Water", icon: Droplets },
  { key: "internet", label: "Internet", icon: Wifi },
  { key: "tv", label: "TV/Cable", icon: Tv },
];

interface Props { open: boolean; onClose: () => void; userId: string; profile: Profile; onComplete: (txn: any) => void; }

const PayBillsDialog = ({ open, onClose, userId, profile, onComplete }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fee = 2;
  const total = (parseFloat(amount) || 0) + fee;

  const handlePay = async () => {
    if (!selected || !accountId || !amount) { toast({ title: "Fill all fields", variant: "destructive" }); return; }
    const amt = parseFloat(amount);
    if (amt <= 0) { toast({ title: "Invalid amount", variant: "destructive" }); return; }
    if (total > (profile.checking_balance ?? 0)) { toast({ title: "Insufficient balance", variant: "destructive" }); return; }

    setSubmitting(true);
    const txnId = `TXN-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newBalance = (profile.checking_balance ?? 0) - total;

    await supabase.from("profiles").update({ checking_balance: newBalance } as any).eq("user_id", userId);
    await (supabase as any).from("transactions").insert({
      user_id: userId, transaction_id: txnId, type: "bill_payment", category: "bills",
      amount: amt, fee, recipient_name: `${BILLS.find(b => b.key === selected)?.label} Bill`,
      recipient_account: accountId, status: "completed", note: `Bill payment - ${selected}`
    });
    await (supabase as any).from("alerts").insert({
      user_id: userId, title: "Bill Payment", message: `$${amt.toFixed(2)} paid for ${selected}`, type: "bill"
    });

    toast({ title: "Bill paid successfully" });
    onComplete({
      transaction_id: txnId, type: "bill_payment", amount: amt, fee, total,
      recipient_name: `${BILLS.find(b => b.key === selected)?.label} Bill`, recipient_bank: selected,
      recipient_account: accountId, sender_name: profile.full_name || profile.username,
      sender_account: profile.account_number, status: "completed", created_at: new Date().toISOString()
    });
    setSelected(null); setAccountId(""); setAmount("");
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Receipt className="w-5 h-5 text-primary" /> Pay Bills</DialogTitle></DialogHeader>

        {!selected ? (
          <div className="grid grid-cols-2 gap-3">
            {BILLS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setSelected(key)} className="flex flex-col items-center gap-2 p-4 bg-muted rounded-xl hover:bg-accent transition-colors">
                <Icon className="w-8 h-8 text-primary" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>← Back</Button>
            <div><Label>Account/Customer ID</Label><Input value={accountId} onChange={e => setAccountId(e.target.value)} placeholder="Enter account ID" /></div>
            <div><Label>Amount ($)</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" /></div>
            {parseFloat(amount) > 0 && (
              <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
                <div className="flex justify-between"><span>Amount</span><span>${parseFloat(amount).toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Fee</span><span>${fee.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold border-t border-border pt-1"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
            )}
            <Button onClick={handlePay} disabled={submitting} className="w-full">{submitting ? "Processing..." : "Pay Bill"}</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PayBillsDialog;
