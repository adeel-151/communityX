import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import { UserCheck, Plus, Search, Phone, LogOut as LogOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import StatusBadge from '@/components/ui/StatusBadge';

const Visitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const toast = useToast();
  const { user } = useContext(AuthContext);

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', purpose: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const res = await axios.get('/api/v1/visitors');
      setVisitors(res.data.data);
    } catch (error) {
      console.error('Error fetching visitors:', error);
      toast.error('Failed to load visitor logs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/v1/visitors', {
        name: formData.name,
        phone: formData.phone,
        purpose: formData.purpose || 'General Visit',
      });
      toast.success('Visitor logged successfully!');
      setIsAddOpen(false);
      setFormData({ name: '', phone: '', purpose: '' });
      fetchVisitors();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to log visitor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckout = async (visitorId) => {
    try {
      await axios.put(`/api/v1/visitors/${visitorId}/status`, { status: 'CheckedOut' });
      toast.success('Visitor checked out successfully!');
      fetchVisitors();
    } catch (error) {
      toast.error('Failed to check out visitor');
    }
  };

  const handleCheckIn = async (visitorId) => {
    try {
      await axios.put(`/api/v1/visitors/${visitorId}/status`, { status: 'CheckedIn' });
      toast.success('Visitor checked in!');
      fetchVisitors();
    } catch (error) {
      toast.error('Failed to check in visitor');
    }
  };

  const filteredVisitors = visitors.filter(visitor => 
    visitor.name.toLowerCase().includes(search.toLowerCase()) || 
    visitor.phone.includes(search)
  );

  const isGuard = user?.role === 'Security Guard';
  const isAdmin = user?.role === 'Society Admin';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <UserCheck className="text-emerald-500" />
            Visitor Log
          </h2>
          <p className="text-slate-500 mt-1">Manage society entry and exit logs.</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md" onClick={() => setIsAddOpen(true)}>
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
                <Label htmlFor="purpose">Purpose of Visit</Label>
                <Input id="purpose" required value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} placeholder="e.g. Delivery, Guest, Maintenance" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                {submitting ? 'Logging...' : 'Log Entry'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-50/50 rounded-t-xl">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              type="text" 
              placeholder="Search by visitor name or phone..." 
              className="pl-10 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-sm text-slate-500 font-medium">
            {filteredVisitors.length} {filteredVisitors.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
        
        <CardContent className="p-0">
          {loading ? (
            <LoadingSkeleton variant="table" rows={5} cols={5} />
          ) : filteredVisitors.length === 0 ? (
            <EmptyState
              icon={UserCheck}
              title="No visitors logged"
              description={search ? 'Try adjusting your search query.' : 'Start by logging a new visitor.'}
              action={!search ? () => setIsAddOpen(true) : undefined}
              actionLabel="Log Visitor"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Visitor Details</th>
                    <th className="px-6 py-4">Purpose</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Time</th>
                    {(isGuard || isAdmin) && <th className="px-6 py-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVisitors.map((v) => (
                    <tr key={v._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 text-white flex items-center justify-center font-bold text-sm">
                            {v.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-800">{v.name}</span>
                            <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Phone size={11} /> {v.phone}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{v.purpose || 'General'}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={v.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {v.entryTime && (
                            <span className="text-xs">
                              <strong className="text-slate-500">In:</strong> {new Date(v.entryTime).toLocaleString()}
                            </span>
                          )}
                          {v.exitTime && (
                            <span className="text-xs">
                              <strong className="text-slate-500">Out:</strong> {new Date(v.exitTime).toLocaleString()}
                            </span>
                          )}
                          {!v.entryTime && !v.exitTime && (
                            <span className="text-xs text-slate-400">{new Date(v.createdAt).toLocaleString()}</span>
                          )}
                        </div>
                      </td>
                      {(isGuard || isAdmin) && (
                        <td className="px-6 py-4 text-right">
                          {v.status === 'Approved' && (
                            <Button variant="outline" size="sm" className="text-xs hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300" onClick={() => handleCheckIn(v._id)}>
                              Check In
                            </Button>
                          )}
                          {v.status === 'CheckedIn' && (
                            <Button variant="outline" size="sm" className="text-xs hover:bg-slate-100" onClick={() => handleCheckout(v._id)}>
                              <LogOutIcon size={14} className="mr-1" />
                              Check Out
                            </Button>
                          )}
                          {v.status === 'Pending' && isAdmin && (
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" size="sm" className="text-xs hover:bg-emerald-50 hover:text-emerald-700" onClick={() => handleCheckIn(v._id)}>
                                Approve & In
                              </Button>
                            </div>
                          )}
                        </td>
                      )}
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
