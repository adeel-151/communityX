import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { 
  Users, AlertCircle, FileText, UserCheck, ArrowRight, 
  Bell, Calendar, Clock, TrendingUp, Plus
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area
} from 'recharts';
import StatCard from '../components/ui/StatCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import StatusBadge from '../components/ui/StatusBadge';

const CHART_COLORS = {
  indigo: '#4F46E5',
  violet: '#8B5CF6',
  pink: '#EC4899',
  emerald: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  blue: '#3B82F6',
  slate: '#94A3B8',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-slate-100">
        <p className="text-sm font-semibold text-slate-700">{label || payload[0]?.name}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-sm text-slate-500 mt-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ background: entry.color }}></span>
            {entry.name}: <span className="font-semibold text-slate-700">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Overview = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ residents: 0, complaints: 0, pendingBills: 0, visitors: 0 });
  const [complaintsByStatus, setComplaintsByStatus] = useState([]);
  const [billingData, setBillingData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [visitorTrend, setVisitorTrend] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, complaintsRes, billsRes, visitorsRes, noticesRes] = await Promise.allSettled([
        axios.get('/api/v1/users'),
        axios.get('/api/v1/complaints'),
        axios.get('/api/v1/bills'),
        axios.get('/api/v1/visitors'),
        axios.get('/api/v1/notices'),
      ]);

      const users = usersRes.status === 'fulfilled' ? usersRes.value.data.data : [];
      const complaints = complaintsRes.status === 'fulfilled' ? complaintsRes.value.data.data : [];
      const bills = billsRes.status === 'fulfilled' ? billsRes.value.data.data : [];
      const visitors = visitorsRes.status === 'fulfilled' ? visitorsRes.value.data.data : [];
      const notices = noticesRes.status === 'fulfilled' ? noticesRes.value.data.data : [];

      // Stats
      const openComplaints = complaints.filter(c => c.status === 'Open' || c.status === 'InProgress').length;
      const pendingBills = bills.filter(b => b.status === 'Pending' || b.status === 'Overdue').length;
      const todayVisitors = visitors.filter(v => {
        const today = new Date().toDateString();
        return new Date(v.createdAt).toDateString() === today;
      }).length;

      setStats({
        residents: users.length,
        complaints: openComplaints,
        pendingBills,
        visitors: todayVisitors,
      });

      // Complaint status distribution for donut chart
      const statusCounts = {};
      complaints.forEach(c => {
        statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
      });
      const statusColors = { Open: CHART_COLORS.amber, InProgress: CHART_COLORS.blue, Resolved: CHART_COLORS.emerald, Closed: CHART_COLORS.slate };
      setComplaintsByStatus(
        Object.entries(statusCounts).map(([name, value]) => ({
          name: name === 'InProgress' ? 'In Progress' : name,
          value,
          color: statusColors[name] || CHART_COLORS.slate,
        }))
      );

      // Billing data for bar chart — group by month
      const monthlyBilling = {};
      bills.forEach(b => {
        const date = new Date(b.createdAt || b.dueDate);
        const monthKey = date.toLocaleString('default', { month: 'short' });
        if (!monthlyBilling[monthKey]) {
          monthlyBilling[monthKey] = { month: monthKey, paid: 0, pending: 0 };
        }
        if (b.status === 'Paid') {
          monthlyBilling[monthKey].paid += b.amount;
        } else {
          monthlyBilling[monthKey].pending += b.amount;
        }
      });
      setBillingData(Object.values(monthlyBilling).slice(-6));

      // Visitor trend for area chart — group by day (last 7 days)
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayKey = date.toLocaleDateString('default', { weekday: 'short' });
        const dayStr = date.toDateString();
        const count = visitors.filter(v => new Date(v.createdAt).toDateString() === dayStr).length;
        last7Days.push({ day: dayKey, visitors: count });
      }
      setVisitorTrend(last7Days);

      // Recent activity — combine latest complaints, notices, visitors
      const activities = [
        ...complaints.slice(0, 3).map(c => ({
          type: 'complaint',
          title: c.title,
          subtitle: `Reported by ${c.residentId?.name || 'Unknown'}`,
          time: c.createdAt,
          status: c.status,
        })),
        ...notices.slice(0, 2).map(n => ({
          type: 'notice',
          title: n.title,
          subtitle: `By ${n.authorId?.name || 'Admin'}`,
          time: n.createdAt,
          status: null,
        })),
        ...visitors.slice(0, 2).map(v => ({
          type: 'visitor',
          title: `${v.name} visited`,
          subtitle: `Purpose: ${v.purpose || 'General'}`,
          time: v.createdAt,
          status: v.status,
        })),
      ]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 6);

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const activityIcon = (type) => {
    switch (type) {
      case 'complaint': return <AlertCircle size={16} className="text-amber-500" />;
      case 'notice': return <Bell size={16} className="text-pink-500" />;
      case 'visitor': return <UserCheck size={16} className="text-blue-500" />;
      default: return <Clock size={16} className="text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="cards" count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><LoadingSkeleton variant="chart" /></div>
          <LoadingSkeleton variant="chart" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome back, {user?.name || 'Admin'}! 👋
          </h2>
          <p className="text-slate-500 mt-1">Here's what's happening in your society today.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/bills')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md hover:shadow-lg w-fit text-sm"
        >
          Generate Report
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 stagger-children">
        <StatCard
          title="Total Residents"
          value={stats.residents}
          icon={Users}
          color="indigo"
          trend="up"
          trendLabel="Active members"
          delay={0}
        />
        <StatCard
          title="Active Complaints"
          value={stats.complaints}
          icon={AlertCircle}
          color="red"
          trend={stats.complaints > 5 ? 'up' : 'down'}
          trendLabel={stats.complaints > 0 ? 'Needs attention' : 'All clear'}
          delay={60}
        />
        <StatCard
          title="Pending Bills"
          value={stats.pendingBills}
          icon={FileText}
          color="amber"
          trend={stats.pendingBills > 10 ? 'up' : 'down'}
          trendLabel="Awaiting payment"
          delay={120}
        />
        <StatCard
          title="Today's Visitors"
          value={stats.visitors}
          icon={UserCheck}
          color="emerald"
          trendLabel="Today's check-ins"
          delay={180}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Billing Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover-glow animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Billing Overview</h3>
              <p className="text-sm text-slate-400 mt-0.5">Monthly revenue breakdown</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-slate-500">Paid</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <span className="text-slate-500">Pending</span>
              </div>
            </div>
          </div>
          {billingData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={billingData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="paid" name="Paid" fill={CHART_COLORS.indigo} radius={[6, 6, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill={CHART_COLORS.amber} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <FileText size={40} className="mb-3 opacity-40" />
              <p className="text-sm">No billing data yet</p>
            </div>
          )}
        </div>

        {/* Complaint Status Donut Chart */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover-glow animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Complaint Status</h3>
          <p className="text-sm text-slate-400 mb-4">Distribution by status</p>
          {complaintsByStatus.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={complaintsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {complaintsByStatus.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {complaintsByStatus.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: item.color }}></div>
                      <span className="text-slate-600">{item.name}</span>
                    </div>
                    <span className="font-semibold text-slate-700">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <AlertCircle size={40} className="mb-3 opacity-40" />
              <p className="text-sm">No complaints data</p>
            </div>
          )}
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitor Traffic Area Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover-glow animate-fade-in-up" style={{ animationDelay: '350ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Visitor Traffic</h3>
              <p className="text-sm text-slate-400 mt-0.5">Last 7 days check-in trend</p>
            </div>
            <TrendingUp size={20} className="text-emerald-500" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={visitorTrend}>
              <defs>
                <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.indigo} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_COLORS.indigo} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="visitors" name="Visitors" stroke={CHART_COLORS.indigo} strokeWidth={2.5} fill="url(#visitorGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity + Quick Actions */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover-glow animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.slice(0, 4).map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="mt-0.5 p-1.5 rounded-lg bg-slate-50 group-hover:bg-slate-100 transition-colors">
                      {activityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{activity.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{activity.subtitle}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap">{getTimeAgo(activity.time)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <Clock size={32} className="mb-2 opacity-40" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover-glow animate-fade-in-up" style={{ animationDelay: '450ms' }}>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="space-y-2.5">
              <button
                onClick={() => navigate('/dashboard/visitors')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 transition-all group"
              >
                <span className="font-medium text-sm">Log Visitor</span>
                <UserCheck size={18} className="text-indigo-600 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/dashboard/complaints')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-slate-700 transition-all group"
              >
                <span className="font-medium text-sm">New Complaint</span>
                <AlertCircle size={18} className="text-amber-600 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/dashboard/notices')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50 text-slate-700 transition-all group"
              >
                <span className="font-medium text-sm">Post Notice</span>
                <Bell size={18} className="text-pink-500 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
