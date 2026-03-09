import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MessageCircle } from "lucide-react";

interface Props { open: boolean; onClose: () => void; userId: string; }

const SupportDialog = ({ open, onClose, userId }: Props) => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ subject: "", message: "", priority: "medium" });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await (supabase as any).from("support_tickets").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    setTickets(data || []);
  };

  useEffect(() => { if (open) load(); }, [open, userId]);

  const handleSubmit = async () => {
    if (!form.subject || !form.message) { toast({ title: "Fill all fields", variant: "destructive" }); return; }
    setLoading(true);
    await (supabase as any).from("support_tickets").insert({ ...form, user_id: userId });
    toast({ title: "Support ticket created" });
    setForm({ subject: "", message: "", priority: "medium" });
    setShowNew(false);
    await load();
    setLoading(false);
  };

  const STATUS_COLORS: Record<string, string> = { open: "bg-blue-100 text-blue-700", in_progress: "bg-yellow-100 text-yellow-700", resolved: "bg-green-100 text-green-700" };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5 text-primary" /> Bank Support</DialogTitle></DialogHeader>

        {showNew ? (
          <div className="space-y-3">
            <div><Label>Subject</Label><Input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="Brief description" /></div>
            <div>
              <Label>Priority</Label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </div>
            <div><Label>Message</Label><textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Describe your issue..." /></div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowNew(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSubmit} disabled={loading} className="flex-1">{loading ? "Submitting..." : "Submit"}</Button>
            </div>
          </div>
        ) : (
          <>
            <Button onClick={() => setShowNew(true)} className="w-full mb-3"><MessageCircle className="w-4 h-4 mr-1" /> New Support Ticket</Button>
            {tickets.length === 0 ? <p className="text-center text-sm text-muted-foreground py-6">No tickets</p> : (
              <div className="space-y-2">
                {tickets.map((t: any) => (
                  <div key={t.id} className="p-3 bg-muted rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{t.subject}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{t.message}</p>
                        {t.response && <div className="mt-2 p-2 bg-background rounded text-xs"><span className="font-bold">Reply: </span>{t.response}</div>}
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${STATUS_COLORS[t.status] || ""}`}>{t.status.replace("_", " ")}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{new Date(t.created_at).toLocaleDateString()}</p>
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

export default SupportDialog;
