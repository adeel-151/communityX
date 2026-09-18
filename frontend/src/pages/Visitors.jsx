import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserCheck, Plus, Search, LogIn, LogOut, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';

const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', visitingFlat: '', purpose: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const res = await axios.get('/api/visitors');
      setVisitors(res.data.data);
    } catch (error) {
      console.error('Error fetching visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // await axios.post('/api/visitors', formData);
      console.log('Logging visitor:', formData);
      setIsAddOpen(false);
      setFormData({ name: '', phone: '', visitingFlat: '', purpose: '' });
      fetchVisitors();
    } catch (error) {
      console.error('Error logging visitor:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredVisitors = visitors.filter(visitor => 
    visitor.name.toLowerCase().includes(search.toLowerCase()) || 
    visitor.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <UserCheck className="text-emerald-500" />
            Visitor Log
          </h2>
          <p className="text-slate-500 mt-1">Manage society entry and exit logs.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsAddOpen(true)}>
          <Plus size={18} className="mr-2" />
          Log Visitor
        </Button>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle>Log New Visitor</DialogTitle>
              <DialogDescription>
                Record the entry of a new visitor at the main gate.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Visitor Name</Label>
                  <Input id="name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Jane Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="03001234567" />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="visitingFlat">Visiting Flat</Label>
                <Input id="visitingFlat" required value={formData.visitingFlat} onChange={(e) => setFormData({...formData, visitingFlat: e.target.value})} placeholder="e.g. 204" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="purpose">Purpose of Visit</Label>
                <Input id="purpose" value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} placeholder="e.g. Delivery, Guest" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700">
                {submitting ? 'Logging...' : 'Log Entry'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="border-slate-100 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50 rounded-t-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              type="text" 
              placeholder="Search by visitor name or phone..." 
              className="pl-10 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading visitor logs...</div>
          ) : filteredVisitors.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No visitors found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Visitor Details</th>
                    <th className="px-6 py-4">Visiting Flat</th>
                    <th className="px-6 py-4">Purpose</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVisitors.map((v) => (
                    <tr key={v._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800">{v.name}</span>
                          <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone size={12} /> {v.phone}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium">Flat {v.visitingFlat}</span>
                      </td>
                      <td className="px-6 py-4">{v.purpose || 'General'}</td>
                      <td className="px-6 py-4">
                        {v.status === 'Checked In' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            <LogIn size={12} /> Inside
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            <LogOut size={12} /> Checked Out
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs">
                            <strong className="text-slate-500">In:</strong> {new Date(v.checkInTime).toLocaleString()}
                          </span>
                          {v.checkOutTime && (
                            <span className="text-xs">
                              <strong className="text-slate-500">Out:</strong> {new Date(v.checkOutTime).toLocaleString()}
                            </span>
                          )}
                        </div>
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

export default Visitors;
