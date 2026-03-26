import { LogOut, User, Bell, MessageCircle, Mail, ChevronRight } from "lucide-react";

interface Props {
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

const SettingsPanel = ({ onNavigate, onLogout }: Props) => {
  const items = [
    { icon: User, label: "Profile", desc: "Edit your personal information", action: "profile" },
    { icon: Bell, label: "Notifications", desc: "View account activity alerts", action: "notifications" },
    { icon: MessageCircle, label: "Customer Service", desc: "Chat with our support team", action: "customer_service" },
    { icon: Mail, label: "Email Us", desc: "gazinggsunn@gmail.com", action: "email" },
  ];

  return (
    <div className="px-4 pt-4">
      <h2 className="font-heading font-bold text-lg text-foreground mb-4">Settings</h2>
      <div className="space-y-2">
        {items.map(({ icon: Icon, label, desc, action }) => (
          <button
            key={action}
            onClick={() => onNavigate(action)}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground truncate">{desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </button>
        ))}
      </div>

      <button
        onClick={onLogout}
        className="w-full flex items-center gap-4 p-4 rounded-xl bg-destructive/5 hover:bg-destructive/10 transition-colors text-left mt-6"
      >
        <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
          <LogOut className="w-5 h-5 text-destructive" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm text-destructive">Sign Out</p>
          <p className="text-xs text-muted-foreground">Log out of your account</p>
        </div>
      </button>
    </div>
  );
};

export default SettingsPanel;
