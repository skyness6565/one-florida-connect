import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ShieldCheck } from "lucide-react";

interface PinDialogProps {
  open: boolean;
  mode: "setup" | "verify";
  userId: string;
  onSuccess: () => void;
  onClose: () => void;
}

const PinDialog = ({ open, mode, userId, onSuccess, onClose }: PinDialogProps) => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const reset = () => { setPin(""); setConfirmPin(""); setStep(1); };

  const handleSetup = async () => {
    if (pin.length !== 4) return;
    if (step === 1) { setStep(2); return; }
    if (pin !== confirmPin) {
      toast({ title: "PINs don't match", description: "Please try again", variant: "destructive" });
      setConfirmPin("");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("user_pins").upsert({ user_id: userId, pin }, { onConflict: "user_id" });
    setLoading(false);
    if (error) { toast({ title: "Error setting PIN", variant: "destructive" }); return; }
    toast({ title: "Transfer PIN created successfully" });
    reset();
    onSuccess();
  };

  const handleVerify = async () => {
    if (pin.length !== 4) return;
    setLoading(true);
    const { data } = await (supabase as any).from("user_pins").select("pin").eq("user_id", userId).single();
    setLoading(false);
    if (data?.pin === pin) { reset(); onSuccess(); }
    else { toast({ title: "Incorrect PIN", variant: "destructive" }); setPin(""); }
  };

  return (
    <Dialog open={open} onOpenChange={() => { reset(); onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <DialogTitle>{mode === "setup" ? (step === 1 ? "Create Transfer PIN" : "Confirm Your PIN") : "Enter Transfer PIN"}</DialogTitle>
          </div>
          <DialogDescription>
            {mode === "setup" ? "Set a 4-digit PIN to authorize transfers" : "Enter your 4-digit PIN to continue"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <InputOTP maxLength={4} value={mode === "setup" && step === 2 ? confirmPin : pin} onChange={mode === "setup" && step === 2 ? setConfirmPin : setPin}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
          <Button onClick={mode === "setup" ? handleSetup : handleVerify} disabled={loading || (mode === "setup" && step === 2 ? confirmPin.length !== 4 : pin.length !== 4)} className="w-full">
            {loading ? "Processing..." : mode === "setup" ? (step === 1 ? "Continue" : "Set PIN") : "Verify PIN"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PinDialog;
