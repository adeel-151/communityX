import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { FileText, Plus, Search, DollarSign, CheckCircle2, Clock, Receipt, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import StatusBadge from '@/components/ui/StatusBadge';
import StatCard from '@/components/ui/StatCard';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const toast = useToast();

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', amount: '', dueDate: '', residentId: '', type: 'Maintenance' });
  const [submitting, setSubmitting] = useState(false);

  // Residents for dropdown
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    fetchBills();
    fetchResidents();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await axios.get('/api/v1/bills');
      setBills(res.data.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast.error('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const res = await axios.get('/api/v1/users');
      setResidents(res.data.data.filter(u => u.role === 'Resident'));
    } catch (error) {
      // Non-critical, resident dropdown will be empty
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/v1/bills', {
        title: formData.title,
        amount: Number(formData.amount),
        dueDate: formData.dueDate,
        residentId: formData.residentId,
        type: formData.type,
      });
      toast.success('Bill generated successfully!');
      setIsAddOpen(false);
      setFormData({ title: '', amount: '', dueDate: '', residentId: '', type: 'Maintenance' });
      fetchBills();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate bill');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkPaid = async (billId) => {
    try {
      await axios.put(`/api/v1/bills/${billId}`, { status: 'Paid', paymentDate: new Date() });
      toast.success('Bill marked as paid!');
      fetchBills();
    } catch (error) {
      toast.error('Failed to update bill status');
    }
  };

  const filteredBills = bills.filter(bill => 
    bill.title?.toLowerCase().includes(search.toLowerCase()) ||
    bill.residentId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Compute summary stats
  const totalRevenue = bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + b.amount, 0);
  const totalPending = bills.filter(b => b.status !== 'Paid').reduce((sum, b) => sum + b.amount, 0);
  const paidCount = bills.filter(b => b.status === 'Paid').length;
  const pendingCount = bills.filter(b => b.status !== 'Paid').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-blue-500" />
            Billing & Invoices
          </h2>
          <p className="text-slate-500 mt-1">Manage society maintenance bills and payments.</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md" onClick={() => setIsAddOpen(true)}>
          <Plus size={18} className="mr-2" />
          Generate Bill
        </Button>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle>Generate New Bill</DialogTitle>
              <DialogDescription>
                Create a maintenance or utility bill for a resident.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="residentId">Resident</Label>
                {residents.length > 0 ? (
                  <Select value={formData.residentId} onValueChange={(val) => setFormData({...formData, residentId: val})}>
                    <SelectTrigger><SelectValue placeholder="Select resident" /></SelectTrigger>
                    <SelectContent>
                      {residents.map(r => (
                        <SelectItem key={r._id} value={r._id}>{r.name} — Unit {r.unitNumber || 'N/A'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input id="residentId" required value={formData.residentId} onChange={(e) => setFormData({...formData, residentId: e.target.value})} placeholder="Resident ID" />
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="title">Bill Title</Label>
                <Input id="title" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. October Maintenance Fee" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount (PKR)</Label>
                  <Input id="amount" type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} placeholder="e.g. 5000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Bill Type</Label>
                  <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Electricity">Electricity</SelectItem>
                      <SelectItem value="Water">Water</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" required value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                {submitting ? 'Generating...' : 'Generate Bill'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard title="Total Revenue" value={`PKR ${totalRevenue.toLocaleString()}`} icon={DollarSign} color="emerald" trendLabel={`${paidCount} paid`} delay={0} />
        <StatCard title="Pending Amount" value={`PKR ${totalPending.toLocaleString()}`} icon={Clock} color="amber" trendLabel={`${pendingCount} unpaid`} delay={60} />
        <StatCard title="Bills Paid" value={paidCount} icon={CheckCircle2} color="blue" delay={120} />
        <StatCard title="Total Bills" value={bills.length} icon={Receipt} color="violet" delay={180} />
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-50/50 rounded-t-xl">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              type="text" 
              placeholder="Search by title or resident name..." 
              className="pl-10 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <CardContent className="p-0">
          {loading ? (
            <LoadingSkeleton variant="table" rows={5} cols={5} />
          ) : filteredBills.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No bills generated yet"
              description={search ? 'Try adjusting your search query.' : 'Generate your first bill to get started.'}
              action={!search ? () => setIsAddOpen(true) : undefined}
              actionLabel="Generate Bill"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Bill Title</th>
                    <th className="px-6 py-4">Issued To</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBills.map((bill) => (
                    <tr key={bill._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{bill.title}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-700">{bill.residentId?.name || 'Unknown'}</span>
                          <span className="text-xs text-slate-400">Unit {bill.residentId?.unitNumber || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">PKR {bill.amount?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{bill.type || 'Maintenance'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={bill.status} />
                      </td>
                      <td className="px-6 py-4">{new Date(bill.dueDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        {bill.status !== 'Paid' ? (
                          <Button variant="outline" size="sm" className="text-xs hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300" onClick={() => handleMarkPaid(bill._id)}>
                            <CheckCircle2 size={14} className="mr-1" />
                            Mark Paid
                          </Button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-medium">✓ Paid {bill.paymentDate ? new Date(bill.paymentDate).toLocaleDateString() : ''}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Bills;
