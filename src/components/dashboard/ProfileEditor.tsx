import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

interface Props {
  profile: Profile;
  userId: string;
  onBack: () => void;
  onUpdate: () => void;
}

const ProfileEditor = ({ profile, userId, onBack, onUpdate }: Props) => {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    full_name: profile.full_name || "",
    username: profile.username || "",
    phone: profile.phone || "",
    address: profile.address || "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        username: form.username,
        phone: form.phone,
        address: form.address,
      })
      .eq("user_id", userId);

    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile Updated", description: "Your information has been saved." });
      onUpdate();
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 2MB allowed.", variant: "destructive" });
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadErr) {
      toast({ title: "Upload failed", description: uploadErr.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("user_id", userId);
    setUploading(false);
    toast({ title: "Photo Updated" });
    onUpdate();
  };

  const fields = [
    { label: "Full Name", key: "full_name", placeholder: "Enter your full name" },
    { label: "Username", key: "username", placeholder: "Enter username" },
    { label: "Phone Number", key: "phone", placeholder: "+1 (000) 000-0000" },
    { label: "Home Address", key: "address", placeholder: "Enter your address" },
  ];

  return (
    <div className="px-4 pt-4">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Settings
      </button>

      <h2 className="font-heading font-bold text-lg text-foreground mb-6">Edit Profile</h2>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-primary/20" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {profile.username?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </div>
        <p className="text-xs text-muted-foreground mt-2">Tap camera to change photo</p>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {fields.map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-1 block">{label}</label>
            <Input
              value={(form as any)[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={placeholder}
              className="bg-muted/50"
            />
          </div>
        ))}

        {/* Read-only fields */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-1 block">Email</label>
          <Input value={profile.email || ""} disabled className="bg-muted/30 text-muted-foreground" />
          <p className="text-[10px] text-muted-foreground mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-1 block">Account Number</label>
          <Input value={profile.account_number || ""} disabled className="bg-muted/30 text-muted-foreground" />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full mt-6 mb-4">
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default ProfileEditor;
