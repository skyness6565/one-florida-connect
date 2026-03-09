import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, CheckCircle } from "lucide-react";
import { useRef } from "react";

interface ReceiptDialogProps {
  open: boolean;
  transaction: any;
  onClose: () => void;
}

const LABELS: Record<string, string> = {
  wire_transfer: "Wire Transfer", local_transfer: "Local Transfer", internal_transfer: "Internal Bank Transfer",
  bill_payment: "Bill Payment", crypto_purchase: "Crypto Purchase"
};

const ReceiptDialog = ({ open, transaction, onClose }: ReceiptDialogProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  if (!transaction) return null;

  const handlePrint = () => {
    const content = receiptRef.current;
    if (!content) return;
    const win = window.open("", "_blank", "width=400,height=700");
    if (!win) return;
    win.document.write(`<html><head><title>Receipt</title><style>
      body{font-family:system-ui,sans-serif;padding:20px;color:#1a1a2e;margin:0}
      .watermark{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:60px;opacity:0.04;font-weight:900;white-space:nowrap;pointer-events:none}
      .receipt{position:relative;max-width:380px;margin:0 auto;border:2px solid #e5e7eb;border-radius:12px;padding:24px;overflow:hidden}
      .header{text-align:center;border-bottom:2px dashed #e5e7eb;padding-bottom:16px;margin-bottom:16px}
      .bank-name{font-size:22px;font-weight:800;color:#2d3a8c;letter-spacing:1px}
      .gold-dot{color:#d4a017}
      .row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px}
      .row .label{color:#6b7280}
      .row .value{font-weight:600;text-align:right;max-width:60%}
      .status{text-align:center;margin:16px 0}
      .stamp{display:inline-flex;align-items:center;gap:6px;background:#dcfce7;color:#16a34a;padding:8px 16px;border-radius:999px;font-weight:700;font-size:13px}
      .footer{text-align:center;margin-top:16px;padding-top:16px;border-top:2px dashed #e5e7eb;font-size:11px;color:#9ca3af}
      .sig{font-family:cursive;font-size:16px;color:#2d3a8c;margin:8px 0}
    </style></head><body>${content.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  const t = transaction;
  const date = new Date(t.created_at || Date.now());

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0">
        <div ref={receiptRef}>
          <div className="relative border-2 border-border rounded-xl p-6 m-4 overflow-hidden bg-background">
            {/* Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[30deg] text-6xl font-black opacity-[0.03] whitespace-nowrap pointer-events-none select-none">
              ONE FLORIDA BANK
            </div>

            {/* Header */}
            <div className="text-center border-b-2 border-dashed border-border pb-4 mb-4">
              <p className="font-heading font-extrabold text-xl text-primary tracking-wide">ONE FLORIDA<span className="text-[hsl(var(--bank-gold))]">.</span></p>
              <p className="text-xs text-muted-foreground mt-1">Official Transaction Receipt</p>
            </div>

            {/* Status */}
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-bold">
                <CheckCircle className="w-4 h-4" /> Successful
              </span>
            </div>

            {/* Details */}
            <div className="space-y-1 text-sm">
              <Row label="Transaction ID" value={t.transaction_id} />
              <Row label="Type" value={LABELS[t.type] || t.type} />
              <Row label="Sender" value={t.sender_name || "Account Holder"} />
              <Row label="Sender Account" value={`•••• ${(t.sender_account || "0000").slice(-4)}`} />
              <Row label="Recipient" value={t.recipient_name || "-"} />
              <Row label="Recipient Bank" value={t.recipient_bank || "-"} />
              {t.recipient_account && <Row label="Recipient Account" value={t.recipient_account} />}
              {t.routing_code && <Row label="SWIFT/Routing" value={t.routing_code} />}
              <div className="border-t border-dashed border-border my-2" />
              <Row label="Amount" value={`$${Number(t.amount).toFixed(2)}`} />
              <Row label="Fee" value={`$${Number(t.fee || 0).toFixed(2)}`} />
              <Row label="Total" value={`$${(Number(t.amount) + Number(t.fee || 0)).toFixed(2)}`} bold />
              <div className="border-t border-dashed border-border my-2" />
              <Row label="Date" value={date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} />
              <Row label="Time" value={date.toLocaleTimeString("en-US")} />
              {t.note && <Row label="Note" value={t.note} />}
            </div>

            {/* Digital Stamp */}
            <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-border">
              <div className="inline-block border-2 border-primary rounded-full px-4 py-1">
                <p className="text-xs font-bold text-primary">DIGITALLY VERIFIED</p>
              </div>
              <p className="font-[cursive] text-primary text-lg mt-2">One Florida Bank</p>
              <p className="text-[10px] text-muted-foreground">Authorized Digital Signature</p>
              <p className="text-[10px] text-muted-foreground mt-2">This is a computer-generated receipt and does not require a physical signature.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 p-4 pt-0">
          <Button variant="outline" onClick={handlePrint} className="flex-1"><Printer className="w-4 h-4 mr-1" /> Print</Button>
          <Button onClick={handlePrint} className="flex-1"><Download className="w-4 h-4 mr-1" /> Download</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div className="flex justify-between py-1">
    <span className="text-muted-foreground">{label}</span>
    <span className={`text-right max-w-[60%] ${bold ? "font-bold text-base" : "font-medium"}`}>{value}</span>
  </div>
);

export default ReceiptDialog;
