import React from 'react';
import { CheckCircle2, Clock, AlertCircle, XCircle, Shield, LogIn, LogOut } from 'lucide-react';

const statusConfig = {
  // Complaint statuses
  'Open': { icon: AlertCircle, bg: 'bg-amber-100', text: 'text-amber-700', label: 'Open' },
  'InProgress': { icon: Clock, bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
  'Resolved': { icon: CheckCircle2, bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Resolved' },
  'Closed': { icon: XCircle, bg: 'bg-slate-100', text: 'text-slate-600', label: 'Closed' },
  // Bill statuses
  'Pending': { icon: Clock, bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
  'Paid': { icon: CheckCircle2, bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Paid' },
  'Overdue': { icon: AlertCircle, bg: 'bg-red-100', text: 'text-red-700', label: 'Overdue' },
  // Visitor statuses
  'Approved': { icon: CheckCircle2, bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Approved' },
  'Denied': { icon: XCircle, bg: 'bg-red-100', text: 'text-red-700', label: 'Denied' },
  'CheckedIn': { icon: LogIn, bg: 'bg-blue-100', text: 'text-blue-700', label: 'Inside' },
  'CheckedOut': { icon: LogOut, bg: 'bg-slate-100', text: 'text-slate-600', label: 'Checked Out' },
  // User statuses
  'Active': { icon: CheckCircle2, bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Active' },
  'Inactive': { icon: XCircle, bg: 'bg-slate-100', text: 'text-slate-600', label: 'Inactive' },
  // Notice priority
  'High': { icon: AlertCircle, bg: 'bg-red-100', text: 'text-red-700', label: 'High Priority' },
  'Normal': { icon: Shield, bg: 'bg-blue-100', text: 'text-blue-700', label: 'Normal' },
  'Low': { icon: Clock, bg: 'bg-slate-100', text: 'text-slate-600', label: 'Low' },
};

const StatusBadge = ({ status, className = '' }) => {
  const config = statusConfig[status] || { 
    icon: AlertCircle, 
    bg: 'bg-slate-100', 
    text: 'text-slate-700', 
    label: status 
  };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
