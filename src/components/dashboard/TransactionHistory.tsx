import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Eye, Filter } from "lucide-react";

interface Props {
  userId: string;
  onViewReceipt: (txn: any) => void;
}

const TYPE_LABELS: Record<string, string> = {
  wire_transfer: "Wire Transfer", local_transfer: "Local Transfer", internal_transfer: "Internal Transfer",
  bill_payment: "Bill Payment", crypto_purchase: "Crypto Purchase", loan_repayment: "Loan Repayment"
};

const TransactionHistory = ({ userId, onViewReceipt }: Props) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let query = (supabase as any).from("transactions").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      if (filter !== "all") query = query.eq("category", filter);
      const { data } = await query;
      setTransactions(data || []);
      setLoading(false);
    };
    load();
  }, [userId, filter]);

  const filters = [
    { key: "all", label: "All" },
    { key: "transfer", label: "Transfers" },
    { key: "bills", label: "Bills" },
    { key: "crypto", label: "Crypto" },
    { key: "loans", label: "Loans" },
  ];

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <div className="flex gap-1 overflow-x-auto">
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === f.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((txn: any) => (
            <div key={txn.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{txn.recipient_name || TYPE_LABELS[txn.type] || txn.type}</p>
                <p className="text-xs text-muted-foreground">{TYPE_LABELS[txn.type] || txn.type}</p>
                <p className="text-xs text-muted-foreground">{new Date(txn.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right flex items-center gap-2">
                <div>
                  <p className="font-bold text-sm text-destructive">-${Number(txn.amount).toFixed(2)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${txn.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {txn.status}
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onViewReceipt({
                  ...txn, sender_name: "", sender_account: txn.sender_account
                })}>
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
