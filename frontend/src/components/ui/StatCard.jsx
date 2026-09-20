import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color = 'indigo', trend, trendLabel, delay = 0 }) => {
  const colorMap = {
    indigo: { bg: 'bg-indigo-50', iconBg: 'bg-indigo-100', iconText: 'text-indigo-600', accent: 'from-indigo-500 to-indigo-600' },
    red: { bg: 'bg-red-50', iconBg: 'bg-red-100', iconText: 'text-red-600', accent: 'from-red-500 to-red-600' },
    amber: { bg: 'bg-amber-50', iconBg: 'bg-amber-100', iconText: 'text-amber-600', accent: 'from-amber-500 to-amber-600' },
    emerald: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600', accent: 'from-emerald-500 to-emerald-600' },
    blue: { bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconText: 'text-blue-600', accent: 'from-blue-500 to-blue-600' },
    pink: { bg: 'bg-pink-50', iconBg: 'bg-pink-100', iconText: 'text-pink-600', accent: 'from-pink-500 to-pink-600' },
    violet: { bg: 'bg-violet-50', iconBg: 'bg-violet-100', iconText: 'text-violet-600', accent: 'from-violet-500 to-violet-600' },
  };

  const c = colorMap[color] || colorMap.indigo;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-slate-400';

  return (
    <div
      className="relative bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover-lift hover-glow overflow-hidden group animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.accent} opacity-80`}></div>

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
          {trendLabel && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendColor}`}>
              <TrendIcon size={14} />
              <span>{trendLabel}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${c.iconBg} ${c.iconText} transition-transform group-hover:scale-110`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
