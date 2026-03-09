import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props { open: boolean; onClose: () => void; userId: string; }

const TYPE_COLORS: Record<string, string> = {
  transfer: "bg-blue-100 text-blue-700",
  login: "bg-green-100 text-green-700",
  bill: "bg-yellow-100 text-yellow-700",
  security: "bg-red-100 text-red-700",
  info: "bg-muted text-muted-foreground",
};

const AlertsPanel = ({ open, onClose, userId }: Props) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from("alerts").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(50);
    setAlerts(data || []);
    setLoading(false);
  };

  useEffect(() => { if (open) load(); }, [open, userId]);

  const markAllRead = async () => {
    await (supabase as any).from("alerts").update({ read: true }).eq("user_id", userId).eq("read", false);
    load();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> Alerts</DialogTitle>
            <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs"><CheckCheck className="w-3 h-3 mr-1" /> Mark all read</Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>
        ) : alerts.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">No alerts</p>
        ) : (
          <div className="space-y-2">
            {alerts.map((a: any) => (
              <div key={a.id} className={`p-3 rounded-lg border ${a.read ? "border-border bg-background" : "border-primary/20 bg-primary/5"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[a.type] || TYPE_COLORS.info}`}>{a.type}</span>
                      {!a.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <p className="font-medium text-sm mt-1">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.message}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{new Date(a.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AlertsPanel;
