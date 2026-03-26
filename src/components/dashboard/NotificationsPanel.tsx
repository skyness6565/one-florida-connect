import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const TYPE_ICONS: Record<string, string> = {
  transfer: "💸",
  login: "🔐",
  bill: "📄",
  security: "🛡️",
  info: "ℹ️",
  incoming: "📥",
  account: "👤",
};

const TYPE_COLORS: Record<string, string> = {
  transfer: "bg-blue-100 text-blue-700",
  login: "bg-green-100 text-green-700",
  bill: "bg-yellow-100 text-yellow-700",
  security: "bg-red-100 text-red-700",
  incoming: "bg-emerald-100 text-emerald-700",
  account: "bg-purple-100 text-purple-700",
  info: "bg-muted text-muted-foreground",
};

interface Props {
  userId: string;
  onBack: () => void;
}

const NotificationsPanel = ({ userId, onBack }: Props) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("alerts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100);
    setAlerts(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [userId]);

  const markAllRead = async () => {
    await supabase.from("alerts").update({ read: true }).eq("user_id", userId).eq("read", false);
    load();
  };

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="px-4 pt-4">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Settings
      </button>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-heading font-bold text-lg text-foreground">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs">
            <CheckCheck className="w-3 h-3 mr-1" /> Mark all read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No notifications yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Activity alerts will appear here</p>
        </div>
      ) : (
        <div className="space-y-2 pb-4">
          {alerts.map((a: any) => (
            <div
              key={a.id}
              className={`p-3 rounded-xl border transition-colors ${
                a.read ? "border-border bg-background" : "border-primary/20 bg-primary/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{TYPE_ICONS[a.type] || TYPE_ICONS.info}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[a.type] || TYPE_COLORS.info}`}>
                      {a.type}
                    </span>
                    {!a.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <p className="font-medium text-sm text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.message}</p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {new Date(a.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;
