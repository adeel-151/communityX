import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import { AlertTriangle, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import StatusBadge from '@/components/ui/StatusBadge';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const toast = useToast();
  const { user } = useContext(AuthContext);

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'Other' });
  const [submitting, setSubmitting] = useState(false);

  // Status update modal
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('/api/v1/complaints');
      setComplaints(res.data.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/v1/complaints', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
      });
      toast.success('Complaint submitted successfully!');
      setIsAddOpen(false);
      setFormData({ title: '', description: '', category: 'Other' });
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedComplaint || !newStatus) return;
    try {
      await axios.put(`/api/v1/complaints/${selectedComplaint._id}`, { status: newStatus });
      toast.success(`Complaint status updated to ${newStatus}`);
      setIsStatusOpen(false);
      setSelectedComplaint(null);
      setNewStatus('');
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to update complaint status');
    }
  };

  const openStatusModal = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setIsStatusOpen(true);
  };

  const filteredComplaints = complaints.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(search.toLowerCase()) || 
      comp.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || comp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusTabs = ['All', 'Open', 'InProgress', 'Resolved', 'Closed'];
  const isAdmin = user?.role === 'Society Admin' || user?.role === 'Maintenance';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" />
            Complaints Management
          </h2>
          <p className="text-slate-500 mt-1">Track and resolve issues reported by residents.</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md" onClick={() => setIsAddOpen(true)}>
          <Plus size={18} className="mr-2" />
          New Complaint
        </Button>
      </div>

      {/* Add Complaint Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle>Raise a New Complaint</DialogTitle>
              <DialogDescription>
                Describe the issue you are facing so the admin can resolve it.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Issue Title</Label>
                <Input id="title" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Water leak in bathroom" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Cleaning">Cleaning</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Detailed Description</Label>
                <textarea 
                  id="description" 
                  required 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="Please provide more details..." 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                {submitting ? 'Submitting...' : 'Submit Complaint'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog (Admin) */}
      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update Complaint Status</DialogTitle>
            <DialogDescription>
              Change the status for: <strong>{selectedComplaint?.title}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>New Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="InProgress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusOpen(false)}>Cancel</Button>
            <Button className="bg-gradient-to-r from-indigo-600 to-violet-600" onClick={handleStatusUpdate}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {statusTabs.map((tab) => {
          const count = tab === 'All' ? complaints.length : complaints.filter(c => c.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                statusFilter === tab
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab === 'InProgress' ? 'In Progress' : tab} 
              <span className={`ml-1.5 text-xs ${statusFilter === tab ? 'text-indigo-200' : 'text-slate-400'}`}>({count})</span>
            </button>
          );
        })}
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50 rounded-t-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              type="text" 
              placeholder="Search complaints by title or description..." 
              className="pl-10 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <CardContent className="p-0">
          {loading ? (
            <LoadingSkeleton variant="table" rows={5} cols={5} />
          ) : filteredComplaints.length === 0 ? (
            <EmptyState
              icon={AlertTriangle}
              title="No complaints found"
              description={search || statusFilter !== 'All' ? 'Try adjusting your filters.' : 'No issues have been reported yet.'}
              action={!search && statusFilter === 'All' ? () => setIsAddOpen(true) : undefined}
              actionLabel="Report Issue"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Reported By</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.map((comp) => (
                    <tr key={comp._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">{comp.title}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[250px]">{comp.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{comp.residentId?.name || 'Unknown'}</span>
                          <span className="text-xs text-slate-400">Unit {comp.residentId?.unitNumber || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{comp.category || 'Other'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={comp.status} />
                      </td>
                      <td className="px-6 py-4">{new Date(comp.createdAt).toLocaleDateString()}</td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => openStatusModal(comp)}
                          >
                            Update Status
                          </Button>
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

export default Complaints;
