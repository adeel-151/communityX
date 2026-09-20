import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = Inbox, 
  title = 'No data found', 
  description = 'There is nothing to display here yet.', 
  action,
  actionLabel = 'Get Started'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 animate-fade-in-up">
      <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
        <Icon size={36} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-slate-400 text-sm text-center max-w-sm mb-6">{description}</p>
      {action && (
        <button
          onClick={action}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
