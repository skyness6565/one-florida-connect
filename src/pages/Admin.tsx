import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Shield, Users, Receipt, DollarSign, Pencil, Trash2, Plus, Minus, LogOut, ArrowLeft, Ban, CheckCircle } from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  full_name: string | null;
  email: string | null;
  checking_balance: number | null;
  savings_balance: number | null;
  account_number: string | null;
  transfer_fee: number | null;
  is_blocked: boolean | null;
}

interface Transaction {
  id: string;
  user_id: string;
  transaction_id: string;
  type: string;
  amount: number;
  status: string;
  category: string;
  recipient_name: string | null;
  recipient_bank: string | null;
  recipient_account: string | null;
  note: string | null;
  fee: number | null;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Balance dialog
  const [balanceDialog, setBalanceDialog] = useState(false);
  const [balanceUser, setBalanceUser] = useState<UserProfile | null>(null);
  const [balanceField, setBalanceField] = useState<"checking_balance" | "savings_balance">("checking_balance");
  const [balanceMode, setBalanceMode] = useState<"add" | "subtract" | "set">("add");
  const [balanceAmount, setBalanceAmount] = useState("");

  // Fee dialog
  const [feeDialog, setFeeDialog] = useState(false);
  const [feeUser, setFeeUser] = useState<UserProfile | null>(null);
  const [feeAmount, setFeeAmount] = useState("");

  // Transaction edit dialog
  const [txnDialog, setTxnDialog] = useState(false);
  const [editTxn, setEditTxn] = useState<Transaction | null>(null);
  const [txnForm, setTxnForm] = useState<Record<string, any>>({});

  const adminCall = async (action: string, params: Record<string, any> = {}) => {
    const { data, error } = await supabase.functions.invoke("admin-actions", {
      body: { action, ...params },
    });
    if (error) throw new Error(error.message || "Admin action failed");
    if (data?.error) throw new Error(data.error);
    return data;
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }

      // Check admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        toast({ title: "Access Denied", description: "You are not authorized to access the admin panel.", variant: "destructive" });
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      await loadUsers();
      setLoading(false);
    };
    init();
  }, [navigate]);

  const loadUsers = async () => {
    try {
      const data = await adminCall("list_users");
      setUsers(data || []);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const loadTransactions = async (userId?: string) => {
    try {
      const data = await adminCall("list_transactions", { user_id: userId || undefined });
      setTransactions(data || []);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleBalanceSubmit = async () => {
    if (!balanceUser || !balanceAmount) return;
    try {
      const amt = Number(balanceAmount);
      if (isNaN(amt) || amt <= 0) throw new Error("Enter a valid positive amount");

      if (balanceMode === "set") {
        await adminCall("set_balance", { user_id: balanceUser.user_id, field: balanceField, amount: amt });
      } else {
        const finalAmt = balanceMode === "subtract" ? -amt : amt;
        await adminCall("update_balance", { user_id: balanceUser.user_id, field: balanceField, amount: finalAmt });
      }
      toast({ title: "Success", description: `Balance updated for ${balanceUser.username}` });
      setBalanceDialog(false);
      setBalanceAmount("");
      await loadUsers();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleFeeSubmit = async () => {
    if (!feeUser || feeAmount === "") return;
    try {
      const fee = Number(feeAmount);
      if (isNaN(fee) || fee < 0) throw new Error("Enter a valid fee amount");
      await adminCall("set_transfer_fee", { user_id: feeUser.user_id, fee });
      toast({ title: "Success", description: `Transfer fee set to $${fee} for ${feeUser.username}` });
      setFeeDialog(false);
      setFeeAmount("");
      await loadUsers();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleToggleBlock = async (u: UserProfile) => {
    try {
      const newBlocked = !u.is_blocked;
      await adminCall("toggle_block", { user_id: u.user_id, blocked: newBlocked });
      toast({ title: "Success", description: `${u.username} has been ${newBlocked ? "blocked" : "unblocked"}` });
      await loadUsers();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleTxnEdit = (txn: Transaction) => {
    setEditTxn(txn);
    setTxnForm({
      amount: txn.amount,
      status: txn.status,
      type: txn.type,
      category: txn.category,
      recipient_name: txn.recipient_name || "",
      recipient_bank: txn.recipient_bank || "",
      recipient_account: txn.recipient_account || "",
      note: txn.note || "",
      fee: txn.fee || 0,
    });
    setTxnDialog(true);
  };

  const handleTxnSave = async () => {
    if (!editTxn) return;
    try {
      await adminCall("update_transaction", { id: editTxn.id, updates: txnForm });
      toast({ title: "Success", description: "Transaction updated" });
      setTxnDialog(false);
      await loadTransactions(selectedUserId || undefined);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleTxnDelete = async (id: string) => {
    try {
      await adminCall("delete_transaction", { id });
      toast({ title: "Deleted", description: "Transaction removed" });
      await loadTransactions(selectedUserId || undefined);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6" />
          <h1 className="font-heading text-xl font-bold">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
          </Button>
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}>
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users" className="gap-2"><Users className="w-4 h-4" /> Users & Balances</TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2" onClick={() => loadTransactions()}><Receipt className="w-4 h-4" /> Transactions</TabsTrigger>
          </TabsList>

          {/* USERS TAB */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Account #</TableHead>
                        <TableHead className="text-right">Checking</TableHead>
                        <TableHead className="text-right">Savings</TableHead>
                        <TableHead className="text-right">Transfer Fee</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.username}</TableCell>
                          <TableCell>{u.full_name || "—"}</TableCell>
                          <TableCell>{u.email || "—"}</TableCell>
                          <TableCell className="font-mono text-xs">{u.account_number || "—"}</TableCell>
                          <TableCell className="text-right font-mono">${(u.checking_balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-right font-mono">${(u.savings_balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-right font-mono">${(u.transfer_fee ?? 0).toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => { setBalanceUser(u); setBalanceDialog(true); }}>
                                <DollarSign className="w-3 h-3 mr-1" /> Balance
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => { setFeeUser(u); setFeeAmount(String(u.transfer_fee ?? 0)); setFeeDialog(true); }}>
                                Fee
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TRANSACTIONS TAB */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <CardTitle className="flex items-center gap-2"><Receipt className="w-5 h-5" /> Transaction History</CardTitle>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Filter by user:</Label>
                    <Select value={selectedUserId || "all"} onValueChange={(v) => { const uid = v === "all" ? null : v; setSelectedUserId(uid); loadTransactions(uid || undefined); }}>
                      <SelectTrigger className="w-[200px]"><SelectValue placeholder="All users" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        {users.map((u) => (
                          <SelectItem key={u.user_id} value={u.user_id}>{u.username}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Txn ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Fee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.length === 0 ? (
                        <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No transactions found. Select a user or load all.</TableCell></TableRow>
                      ) : transactions.map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell className="text-xs">{new Date(txn.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="font-mono text-xs">{txn.transaction_id.slice(0, 12)}...</TableCell>
                          <TableCell className="capitalize">{txn.type.replace("_", " ")}</TableCell>
                          <TableCell className="capitalize">{txn.category}</TableCell>
                          <TableCell>{txn.recipient_name || "—"}</TableCell>
                          <TableCell className="text-right font-mono">${txn.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-right font-mono">${(txn.fee ?? 0).toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${txn.status === "completed" ? "bg-green-100 text-green-800" : txn.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                              {txn.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleTxnEdit(txn)}>
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => handleTxnDelete(txn.id)}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Balance Dialog */}
      <Dialog open={balanceDialog} onOpenChange={setBalanceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Balance — {balanceUser?.username}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Account</Label>
              <Select value={balanceField} onValueChange={(v: any) => setBalanceField(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking_balance">Checking</SelectItem>
                  <SelectItem value="savings_balance">Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Operation</Label>
              <Select value={balanceMode} onValueChange={(v: any) => setBalanceMode(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="add"><span className="flex items-center gap-1"><Plus className="w-3 h-3" /> Add</span></SelectItem>
                  <SelectItem value="subtract"><span className="flex items-center gap-1"><Minus className="w-3 h-3" /> Subtract</span></SelectItem>
                  <SelectItem value="set">Set Exact Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount ($)</Label>
              <Input type="number" min="0" step="0.01" value={balanceAmount} onChange={(e) => setBalanceAmount(e.target.value)} placeholder="0.00" />
            </div>
            <p className="text-xs text-muted-foreground">
              Current {balanceField === "checking_balance" ? "checking" : "savings"}: ${(balanceUser?.[balanceField] ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBalanceDialog(false)}>Cancel</Button>
            <Button onClick={handleBalanceSubmit}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fee Dialog */}
      <Dialog open={feeDialog} onOpenChange={setFeeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Transfer Fee — {feeUser?.username}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Transfer Fee ($)</Label>
              <Input type="number" min="0" step="0.01" value={feeAmount} onChange={(e) => setFeeAmount(e.target.value)} placeholder="0.00" />
            </div>
            <p className="text-xs text-muted-foreground">This fee will be charged on every transfer made by this user.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeeDialog(false)}>Cancel</Button>
            <Button onClick={handleFeeSubmit}>Save Fee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction Edit Dialog */}
      <Dialog open={txnDialog} onOpenChange={setTxnDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Amount</Label>
                <Input type="number" value={txnForm.amount || ""} onChange={(e) => setTxnForm({ ...txnForm, amount: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Fee</Label>
                <Input type="number" value={txnForm.fee || ""} onChange={(e) => setTxnForm({ ...txnForm, fee: Number(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Status</Label>
                <Select value={txnForm.status || ""} onValueChange={(v) => setTxnForm({ ...txnForm, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type</Label>
                <Input value={txnForm.type || ""} onChange={(e) => setTxnForm({ ...txnForm, type: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <Input value={txnForm.category || ""} onChange={(e) => setTxnForm({ ...txnForm, category: e.target.value })} />
            </div>
            <div>
              <Label>Recipient Name</Label>
              <Input value={txnForm.recipient_name || ""} onChange={(e) => setTxnForm({ ...txnForm, recipient_name: e.target.value })} />
            </div>
            <div>
              <Label>Recipient Bank</Label>
              <Input value={txnForm.recipient_bank || ""} onChange={(e) => setTxnForm({ ...txnForm, recipient_bank: e.target.value })} />
            </div>
            <div>
              <Label>Recipient Account</Label>
              <Input value={txnForm.recipient_account || ""} onChange={(e) => setTxnForm({ ...txnForm, recipient_account: e.target.value })} />
            </div>
            <div>
              <Label>Note</Label>
              <Input value={txnForm.note || ""} onChange={(e) => setTxnForm({ ...txnForm, note: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTxnDialog(false)}>Cancel</Button>
            <Button onClick={handleTxnSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
