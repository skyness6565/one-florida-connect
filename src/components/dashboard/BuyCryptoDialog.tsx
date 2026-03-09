import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CreditCard } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const CRYPTOS = [
  { symbol: "BTC", name: "Bitcoin", price: 67500 },
  { symbol: "ETH", name: "Ethereum", price: 3450 },
  { symbol: "USDT", name: "Tether", price: 1.0 },
];

interface Props { open: boolean; onClose: () => void; userId: string; profile: Profile; onComplete: (txn: any) => void; }

const BuyCryptoDialog = ({ open, onClose, userId, profile, onComplete }: Props) => {
  const [selected, setSelected] = useState<typeof CRYPTOS[0] | null>(null);
  const [amount, setAmount] = useState("");
  const [holdings, setHoldings] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      (supabase as any).from("crypto_holdings").select("*").eq("user_id", userId).then(({ data }: any) => setHoldings(data || []));
    }
  }, [open, userId]);

  const usdAmount = parseFloat(amount) || 0;
  const fee = usdAmount * 0.01;
  const total = usdAmount + fee;
  const cryptoAmount = selected ? usdAmount / selected.price : 0;

  const handleBuy = async () => {
    if (!selected || usdAmount <= 0) { toast({ title: "Enter valid amount", variant: "destructive" }); return; }
    if (total > (profile.checking_balance ?? 0)) { toast({ title: "Insufficient balance", variant: "destructive" }); return; }

    setSubmitting(true);
    const txnId = `TXN-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newBalance = (profile.checking_balance ?? 0) - total;

    await supabase.from("profiles").update({ checking_balance: newBalance } as any).eq("user_id", userId);

    const existing = holdings.find(h => h.symbol === selected.symbol);
    if (existing) {
      const newAmount = Number(existing.amount) + cryptoAmount;
      const newAvg = ((Number(existing.avg_price) * Number(existing.amount)) + (selected.price * cryptoAmount)) / newAmount;
      await (supabase as any).from("crypto_holdings").update({ amount: newAmount, avg_price: newAvg }).eq("id", existing.id);
    } else {
      await (supabase as any).from("crypto_holdings").insert({ user_id: userId, symbol: selected.symbol, amount: cryptoAmount, avg_price: selected.price });
    }

    await (supabase as any).from("transactions").insert({
      user_id: userId, transaction_id: txnId, type: "crypto_purchase", category: "crypto",
      amount: usdAmount, fee, recipient_name: `${selected.name} (${selected.symbol})`,
      status: "completed", metadata: { crypto_amount: cryptoAmount, price: selected.price }
    });

    toast({ title: `${selected.symbol} purchased!`, description: `${cryptoAmount.toFixed(8)} ${selected.symbol}` });
    onComplete({
      transaction_id: txnId, type: "crypto_purchase", amount: usdAmount, fee, total,
      recipient_name: `${selected.name} (${selected.symbol})`, recipient_bank: "Crypto Exchange",
      sender_name: profile.full_name || profile.username, sender_account: profile.account_number,
      status: "completed", created_at: new Date().toISOString()
    });
    setSelected(null); setAmount("");
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Buy Crypto</DialogTitle></DialogHeader>

        {/* Holdings */}
        {holdings.length > 0 && (
          <div className="bg-muted rounded-lg p-3 mb-2">
            <p className="text-xs font-bold text-muted-foreground mb-2">YOUR HOLDINGS</p>
            {holdings.map((h: any) => (
              <div key={h.id} className="flex justify-between text-sm py-1">
                <span className="font-medium">{h.symbol}</span>
                <span>{Number(h.amount).toFixed(6)} (≈${(Number(h.amount) * (CRYPTOS.find(c => c.symbol === h.symbol)?.price || 0)).toFixed(2)})</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          {CRYPTOS.map(c => (
            <button key={c.symbol} onClick={() => setSelected(c)}
              className={`p-3 rounded-xl text-center transition-colors ${selected?.symbol === c.symbol ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}>
              <p className="font-bold text-sm">{c.symbol}</p>
              <p className="text-xs opacity-70">${c.price.toLocaleString()}</p>
            </button>
          ))}
        </div>

        {selected && (
          <div className="space-y-3 mt-2">
            <div><Label>Amount (USD)</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" /></div>
            {usdAmount > 0 && (
              <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
                <div className="flex justify-between"><span>You get</span><span className="font-bold">{cryptoAmount.toFixed(8)} {selected.symbol}</span></div>
                <div className="flex justify-between"><span>Fee (1%)</span><span>${fee.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold border-t border-border pt-1"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
            )}
            <Button onClick={handleBuy} disabled={submitting} className="w-full">{submitting ? "Processing..." : `Buy ${selected.symbol}`}</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BuyCryptoDialog;
