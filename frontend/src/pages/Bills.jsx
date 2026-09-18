import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Plus, Search, DollarSign, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({ description: '', amount: '', dueDate: '', issuedTo: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await axios.get('/api/bills');
      setBills(res.data.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // await axios.post('/api/bills', formData);
      console.log('Generating bill:', formData);
      setIsAddOpen(false);
      setFormData({ description: '', amount: '', dueDate: '', issuedTo: '' });
      fetchBills();
    } catch (error) {
      console.error('Error generating bill:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBills = bills.filter(bill => 
    bill.issuedTo?.name?.toLowerCase().includes(search.toLowerCase()) || 
    bill.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-blue-500" />
            Billing & Invoices
          </h2>
          <p className="text-slate-500 mt-1">Manage society maintenance bills and payments.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsAddOpen(true)}>
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
                <Label htmlFor="issuedTo">Resident ID (Temp)</Label>
                <Input id="issuedTo" required value={formData.issuedTo} onChange={(e) => setFormData({...formData, issuedTo: e.target.value})} placeholder="User ID or Flat Number" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Bill Description</Label>
                <Input id="description" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="e.g. October Maintenance Fee" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount (PKR)</Label>
                  <Input id="amount" type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} placeholder="e.g. 5000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" required value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700">
                {submitting ? 'Generating...' : 'Generate Bill'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-indigo-100 bg-indigo-50/50 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-800">PKR 0</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50 rounded-t-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              type="text" 
              placeholder="Search by resident name or description..." 
              className="pl-10 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading bills...</div>
          ) : filteredBills.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No bills generated yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Invoice Description</th>
                    <th className="px-6 py-4">Issued To</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBills.map((bill) => (
                    <tr key={bill._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">{bill.description}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-700">{bill.issuedTo?.name || 'Unknown'}</span>
                          <span className="text-xs text-slate-400">Flat {bill.issuedTo?.flatNumber}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">PKR {bill.amount}</td>
                      <td className="px-6 py-4">
                        {bill.status === 'Paid' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            <CheckCircle2 size={12} /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <Clock size={12} /> Unpaid
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">{new Date(bill.dueDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="outline" size="sm" className="text-xs">
                          {bill.status === 'Paid' ? 'View Receipt' : 'Mark Paid'}
                        </Button>
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
