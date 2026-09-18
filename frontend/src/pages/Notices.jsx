import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Plus, Pin, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', validUntil: '', isPinned: false });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await axios.get('/api/notices');
      setNotices(res.data.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // await axios.post('/api/notices', formData);
      console.log('Creating notice:', formData);
      setIsAddOpen(false);
      setFormData({ title: '', content: '', validUntil: '', isPinned: false });
      fetchNotices();
    } catch (error) {
      console.error('Error creating notice:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="text-pink-500" />
            Notice Board
          </h2>
          <p className="text-slate-500 mt-1">Important announcements and society updates.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsAddOpen(true)}>
          <Plus size={18} className="mr-2" />
          Create Notice
        </Button>
      </div>

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

              <div className="flex items-center gap-4">
                <div className="grid gap-2 flex-1">
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input id="validUntil" type="date" required value={formData.validUntil} onChange={(e) => setFormData({...formData, validUntil: e.target.value})} />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input 
                    type="checkbox" 
                    id="isPinned" 
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({...formData, isPinned: e.target.checked})}
                  />
                  <Label htmlFor="isPinned" className="cursor-pointer">Pin to Top</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700">
                {submitting ? 'Posting...' : 'Post Notice'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-4 mt-6">
        {loading ? (
          <div className="p-8 text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-100">Loading notices...</div>
        ) : notices.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
            <Bell size={48} className="text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-700">No active notices.</p>
            <p className="text-sm">When announcements are made, they will appear here.</p>
          </div>
        ) : (
          notices.map((notice) => (
            <Card key={notice._id} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              {notice.isPinned && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-pink-500 to-transparent">
                  <Pin className="absolute top-2 right-2 text-white" size={16} />
                </div>
              )}
              
              <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/30">
                <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                  {notice.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(notice.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><User size={14} /> {notice.createdBy?.name || 'Admin'}</span>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full font-medium">Valid till: {new Date(notice.validUntil).toLocaleDateString()}</span>
                </div>
              </CardHeader>
              
              <CardContent className="p-5 text-slate-600 whitespace-pre-wrap leading-relaxed">
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
