import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { FileText } from "lucide-react";

interface Props { open: boolean; onClose: () => void; userId: string; type: "savings" | "checking"; }

const StatementsDialog = ({ open, onClose, userId, type }: Props) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      setLoading(true);
      const { data } = await (supabase as any).from("transactions").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(50);
      const filtered = (data || []).filter((t: any) => {
        if (type === "savings") return t.type === "internal_transfer" && (t.note?.includes("Savings") || t.recipient_name?.includes("Savings"));
        return true; // checking shows all
      });
      setTransactions(filtered);
      setLoading(false);
    };
    load();
  }, [open, userId, type]);

  const totalIn = transactions.filter((t: any) => t.note?.includes("→ Checking") || t.type === "internal_transfer" && t.recipient_name?.includes("Checking")).reduce((s: number, t: any) => s + Number(t.amount), 0);
  const totalOut = transactions.filter((t: any) => t.type !== "internal_transfer" || !t.recipient_name?.includes("Checking")).reduce((s: number, t: any) => s + Number(t.amount), 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> {type === "savings" ? "Savings" : "Checking"} Statement
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <p className="text-xs text-green-600 font-medium">Total In</p>
            <p className="font-bold text-green-700">${totalIn.toFixed(2)}</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-center">
            <p className="text-xs text-red-600 font-medium">Total Out</p>
            <p className="font-bold text-red-700">${totalOut.toFixed(2)}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>
        ) : transactions.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">No transactions found</p>
        ) : (
          <div className="space-y-2">
            {transactions.map((t: any) => (
              <div key={t.id} className="flex justify-between items-center p-3 bg-muted rounded-lg text-sm">
                <div>
                  <p className="font-medium">{t.recipient_name || t.type}</p>
                  <p className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</p>
                </div>
                <span className="font-bold text-destructive">-${Number(t.amount).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        <Button variant="outline" onClick={() => window.print()} className="w-full mt-2">
          <FileText className="w-4 h-4 mr-1" /> Print Statement
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default StatementsDialog;
