import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ArrowUpRight, ArrowDownLeft, RefreshCw, AlertTriangle } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

interface TransferDialogProps {
  open: boolean;
  type: "wire_transfer" | "local_transfer" | "internal_transfer";
  profile: Profile;
  userId: string;
  onComplete: (txn: any) => void;
  onClose: () => void;
}

const FEES: Record<string, number> = { wire_transfer: 25, local_transfer: 5, internal_transfer: 0 };
const LABELS: Record<string, string> = { wire_transfer: "Wire Transfer", local_transfer: "Local Transfer", internal_transfer: "Internal Transfer" };
const ICONS: Record<string, any> = { wire_transfer: ArrowUpRight, local_transfer: ArrowDownLeft, internal_transfer: RefreshCw };

const TransferDialog = ({ open, type, profile, userId, onComplete, onClose }: TransferDialogProps) => {
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [submitting, setSubmitting] = useState(false);
  const [isOwnAccount, setIsOwnAccount] = useState(false);
  const [form, setForm] = useState({
    recipientName: "", recipientBank: "One Florida Bank", accountNumber: "",
    routingCode: "", amount: "", note: "", direction: "checking_to_savings"
  });

  const fee = FEES[type] || 0;
  const amount = parseFloat(form.amount) || 0;
  const total = amount + fee;
  const balance = profile.checking_balance ?? 0;
  const Icon = ICONS[type];

  const set = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const validate = () => {
    if (type === "internal_transfer" && isOwnAccount) {
      if (amount <= 0) { toast({ title: "Enter a valid amount", variant: "destructive" }); return false; }
      const sourceBalance = form.direction === "checking_to_savings" ? (profile.checking_balance ?? 0) : (profile.savings_balance ?? 0);
      if (total > sourceBalance) { toast({ title: "Insufficient balance", variant: "destructive" }); return false; }
      return true;
    }
    if (!form.recipientName.trim()) { toast({ title: "Recipient name required", variant: "destructive" }); return false; }
    if (!form.accountNumber.trim()) { toast({ title: "Account number required", variant: "destructive" }); return false; }
    if (type === "wire_transfer" && !form.routingCode.trim()) { toast({ title: "SWIFT code required", variant: "destructive" }); return false; }
    if (amount <= 0) { toast({ title: "Enter a valid amount", variant: "destructive" }); return false; }
    if (total > balance) { toast({ title: "Insufficient balance", variant: "destructive" }); return false; }
    if (amount > 50000) { toast({ title: "Transfer limit is $50,000", variant: "destructive" }); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (step === "form") { if (validate()) setStep("confirm"); return; }
    setSubmitting(true);
    const txnId = `TXN-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    try {
      if (type === "internal_transfer" && isOwnAccount) {
        const isC2S = form.direction === "checking_to_savings";
        const newChecking = (profile.checking_balance ?? 0) + (isC2S ? -amount : amount);
        const newSavings = (profile.savings_balance ?? 0) + (isC2S ? amount : -amount);
        await supabase.from("profiles").update({ checking_balance: newChecking, savings_balance: newSavings } as any).eq("user_id", userId);
        await (supabase as any).from("transactions").insert({
          user_id: userId, transaction_id: txnId, type, category: "transfer", amount, fee: 0,
          recipient_name: isC2S ? "Savings Account" : "Checking Account",
          recipient_bank: "One Florida Bank", recipient_account: profile.account_number,
          sender_account: profile.account_number, note: form.note || `${isC2S ? "Checking → Savings" : "Savings → Checking"}`, status: "completed"
        });
      } else {
        const newBalance = balance - total;
        await supabase.from("profiles").update({ checking_balance: newBalance } as any).eq("user_id", userId);
        await (supabase as any).from("transactions").insert({
          user_id: userId, transaction_id: txnId, type, category: "transfer", amount, fee,
          recipient_name: form.recipientName, recipient_bank: form.recipientBank || "One Florida Bank",
          recipient_account: form.accountNumber, routing_code: form.routingCode,
          sender_account: profile.account_number, note: form.note, status: "completed"
        });
      }

      await (supabase as any).from("alerts").insert({
        user_id: userId, title: `${LABELS[type]} Successful`,
        message: `$${amount.toFixed(2)} transferred successfully. Fee: $${fee.toFixed(2)}`, type: "transfer"
      });

      const txnData = {
        transaction_id: txnId, type, amount, fee, total, status: "completed",
        recipient_name: isOwnAccount ? (form.direction === "checking_to_savings" ? "Savings Account" : "Checking Account") : form.recipientName,
        recipient_bank: form.recipientBank || "One Florida Bank", recipient_account: form.accountNumber || profile.account_number,
        routing_code: form.routingCode, sender_name: profile.full_name || profile.username,
        sender_account: profile.account_number, note: form.note, created_at: new Date().toISOString()
      };

      toast({ title: "Transfer Successful", description: `$${amount.toFixed(2)} sent successfully` });
      setForm({ recipientName: "", recipientBank: "One Florida Bank", accountNumber: "", routingCode: "", amount: "", note: "", direction: "checking_to_savings" });
      setStep("form");
      setIsOwnAccount(false);
      onComplete(txnData);
    } catch (err) {
      toast({ title: "Transfer failed", variant: "destructive" });
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => { setStep("form"); onClose(); }}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary" /> {LABELS[type]}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {step === "form" && (
            <>
              {type === "internal_transfer" && (
                <div className="flex gap-2">
                  <Button variant={!isOwnAccount ? "default" : "outline"} size="sm" onClick={() => setIsOwnAccount(false)} className="flex-1 text-xs">To Other Customer</Button>
                  <Button variant={isOwnAccount ? "default" : "outline"} size="sm" onClick={() => setIsOwnAccount(true)} className="flex-1 text-xs">Between My Accounts</Button>
                </div>
              )}

              {type === "internal_transfer" && isOwnAccount ? (
                <div className="space-y-3">
                  <Label>Direction</Label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.direction} onChange={e => set("direction", e.target.value)}>
                    <option value="checking_to_savings">Checking → Savings</option>
                    <option value="savings_to_checking">Savings → Checking</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Available: ${form.direction === "checking_to_savings" ? (profile.checking_balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 }) : (profile.savings_balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ) : !isOwnAccount || type !== "internal_transfer" ? (
                <>
                  <div><Label>Recipient Name</Label><Input value={form.recipientName} onChange={e => set("recipientName", e.target.value)} placeholder="Full name" /></div>
                  {type !== "internal_transfer" && <div><Label>Recipient Bank</Label><Input value={form.recipientBank} onChange={e => set("recipientBank", e.target.value)} /></div>}
                  <div><Label>Account Number</Label><Input value={form.accountNumber} onChange={e => set("accountNumber", e.target.value)} placeholder="Enter account number" /></div>
                  {type === "wire_transfer" && <div><Label>SWIFT/Routing Code</Label><Input value={form.routingCode} onChange={e => set("routingCode", e.target.value)} placeholder="SWIFT code" /></div>}
                </>
              ) : null}

              <div><Label>Amount ($)</Label><Input type="number" value={form.amount} onChange={e => set("amount", e.target.value)} placeholder="0.00" min="0" /></div>
              <div><Label>Note (Optional)</Label><Input value={form.note} onChange={e => set("note", e.target.value)} placeholder="Transfer note" /></div>

              {amount > 10000 && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-sm text-destructive">
                  <AlertTriangle className="w-4 h-4" /> Large transfer — additional verification may apply
                </div>
              )}

              {amount > 0 && <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
                <div className="flex justify-between"><span>Amount</span><span>${amount.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Fee</span><span>${fee.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold border-t border-border pt-1"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>}

              <Button onClick={handleSubmit} className="w-full">Review Transfer</Button>
            </>
          )}

          {step === "confirm" && (
            <>
              <div className="bg-muted p-4 rounded-xl space-y-2 text-sm">
                <p className="font-bold text-base mb-3">Confirm Transfer</p>
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{LABELS[type]}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">To</span><span className="font-medium">{isOwnAccount ? (form.direction === "checking_to_savings" ? "Savings" : "Checking") : form.recipientName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-medium">${amount.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Fee</span><span className="font-medium">${fee.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-base border-t border-border pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("form")} className="flex-1">Back</Button>
                <Button onClick={handleSubmit} disabled={submitting} className="flex-1">{submitting ? "Processing..." : "Confirm & Send"}</Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransferDialog;
