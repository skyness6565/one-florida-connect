import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { UserPlus, Trash2 } from "lucide-react";

interface Props { open: boolean; onClose: () => void; userId: string; }

const BeneficiaryDialog = ({ open, onClose, userId }: Props) => {
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", bank_name: "", account_number: "", routing_code: "", nickname: "" });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await (supabase as any).from("beneficiaries").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    setBeneficiaries(data || []);
  };

  useEffect(() => { if (open) load(); }, [open, userId]);

  const handleAdd = async () => {
    if (!form.name || !form.bank_name || !form.account_number) { toast({ title: "Fill all required fields", variant: "destructive" }); return; }
    setLoading(true);
    await (supabase as any).from("beneficiaries").insert({ ...form, user_id: userId });
    toast({ title: "Beneficiary added" });
    setForm({ name: "", bank_name: "", account_number: "", routing_code: "", nickname: "" });
    setShowAdd(false);
    await load();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await (supabase as any).from("beneficiaries").delete().eq("id", id);
    toast({ title: "Beneficiary removed" });
    load();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5 text-primary" /> Beneficiaries</DialogTitle></DialogHeader>

        {showAdd ? (
          <div className="space-y-3">
            <div><Label>Full Name *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div><Label>Bank Name *</Label><Input value={form.bank_name} onChange={e => setForm(p => ({ ...p, bank_name: e.target.value }))} /></div>
            <div><Label>Account Number *</Label><Input value={form.account_number} onChange={e => setForm(p => ({ ...p, account_number: e.target.value }))} /></div>
            <div><Label>Routing Code</Label><Input value={form.routing_code} onChange={e => setForm(p => ({ ...p, routing_code: e.target.value }))} /></div>
            <div><Label>Nickname</Label><Input value={form.nickname} onChange={e => setForm(p => ({ ...p, nickname: e.target.value }))} /></div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleAdd} disabled={loading} className="flex-1">{loading ? "Saving..." : "Save"}</Button>
            </div>
          </div>
        ) : (
          <>
            <Button onClick={() => setShowAdd(true)} className="w-full mb-3"><UserPlus className="w-4 h-4 mr-1" /> Add Beneficiary</Button>
            {beneficiaries.length === 0 ? <p className="text-center text-sm text-muted-foreground py-6">No beneficiaries saved</p> : (
              <div className="space-y-2">
                {beneficiaries.map((b: any) => (
                  <div key={b.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{b.nickname || b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.bank_name} • {b.account_number}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(b.id)}><Trash2 className="w-4 h-4" /></Button>
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

export default BeneficiaryDialog;
