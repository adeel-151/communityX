import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, AlertCircle, FileText, UserCheck, ArrowRight } from 'lucide-react';

const Overview = () => {
  const { user } = useContext(AuthContext);

  const stats = [
    { title: 'Total Residents', value: '124', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Active Complaints', value: '8', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
    { title: 'Pending Bills', value: '32', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Today\'s Visitors', value: '15', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name || 'Admin'}! 👋</h2>
          <p className="text-slate-500 mt-1">Here's what's happening in your society today.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm w-fit">
          Generate Report
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <FileText size={48} className="mb-4 opacity-50" />
            <p>No recent activity to show.</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 transition-colors">
              <span className="font-medium">Approve Visitor</span>
              <UserCheck size={18} className="text-indigo-600" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-slate-700 transition-colors">
              <span className="font-medium">Assign Complaint</span>
              <AlertCircle size={18} className="text-amber-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
