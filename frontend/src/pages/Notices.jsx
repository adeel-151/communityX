import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import { Bell, Plus, Calendar, User, Trash2, AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import StatusBadge from '@/components/ui/StatusBadge';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { user } = useContext(AuthContext);

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', expiresAt: '', priority: 'Normal' });
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isAdmin = user?.role === 'Society Admin';

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await axios.get('/api/v1/notices');
      setNotices(res.data.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/v1/notices', {
        title: formData.title,
        content: formData.content,
        expiresAt: formData.expiresAt || undefined,
        priority: formData.priority,
      });
      toast.success('Notice posted successfully!');
      setIsAddOpen(false);
      setFormData({ title: '', content: '', expiresAt: '', priority: 'Normal' });
      fetchNotices();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create notice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/v1/notices/${deleteTarget}`);
      toast.success('Notice deleted');
      setDeleteTarget(null);
      fetchNotices();
    } catch (error) {
      toast.error('Failed to delete notice');
    }
  };

  const priorityAccent = (priority) => {
    switch (priority) {
      case 'High': return 'border-l-4 border-l-red-500';
      case 'Normal': return 'border-l-4 border-l-blue-500';
      case 'Low': return 'border-l-4 border-l-slate-300';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="text-pink-500" />
            Notice Board
          </h2>
          <p className="text-slate-500 mt-1">Important announcements and society updates.</p>
        </div>
        {isAdmin && (
          <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md" onClick={() => setIsAddOpen(true)}>
            <Plus size={18} className="mr-2" />
            Create Notice
          </Button>
        )}
      </div>

      {/* Create Notice Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle>Create New Notice</DialogTitle>
              <DialogDescription>
                Post an announcement to the society notice board.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Notice Title</Label>
                <Input id="title" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Scheduled Power Outage" />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content">Announcement Content</Label>
                <textarea 
                  id="content" 
                  required 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50" 
                  value={formData.content} 
                  onChange={(e) => setFormData({...formData, content: e.target.value})} 
                  placeholder="Write your announcement details here..." 
                />
              </div>

              <div className="flex items-start gap-4">
                <div className="grid gap-2 flex-1">
                  <Label htmlFor="expiresAt">Expires On (Optional)</Label>
                  <Input id="expiresAt" type="date" value={formData.expiresAt} onChange={(e) => setFormData({...formData, expiresAt: e.target.value})} />
                </div>
                <div className="grid gap-2 flex-1">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(val) => setFormData({...formData, priority: val})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                {submitting ? 'Posting...' : 'Post Notice'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 size={20} />
              Delete Notice
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this notice? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notices List */}
      <div className="space-y-4 mt-6">
        {loading ? (
          <LoadingSkeleton variant="notices" count={3} />
        ) : notices.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <EmptyState
              icon={Bell}
              title="No active notices"
              description="When announcements are made, they will appear here."
              action={isAdmin ? () => setIsAddOpen(true) : undefined}
              actionLabel="Create Notice"
            />
          </div>
        ) : (
          notices.map((notice, i) => (
            <Card
              key={notice._id}
              className={`border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden animate-fade-in-up ${priorityAccent(notice.priority)}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Priority badge for High */}
              {notice.priority === 'High' && (
                <div className="bg-red-50 px-5 py-2 flex items-center gap-2">
                  <AlertCircle size={14} className="text-red-500" />
                  <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">High Priority</span>
                </div>
              )}
              
              <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/30">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-slate-800">{notice.title}</CardTitle>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-red-500 -mr-2"
                      onClick={() => setDeleteTarget(notice._id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(notice.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><User size={14} /> {notice.authorId?.name || 'Admin'}</span>
                  <StatusBadge status={notice.priority || 'Normal'} />
                  {notice.expiresAt && (
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full font-medium">
                      Expires: {new Date(notice.expiresAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-5 text-slate-600 whitespace-pre-wrap leading-relaxed text-sm">
                {notice.content}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notices;
