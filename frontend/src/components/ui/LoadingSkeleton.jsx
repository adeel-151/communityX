import React from 'react';

const variants = {
  table: ({ rows = 5, cols = 5 }) => (
    <div className="animate-fade-in">
      <div className="flex gap-4 p-4 border-b border-slate-100">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="skeleton h-4 flex-1" style={{ maxWidth: i === 0 ? '150px' : '120px' }}></div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex items-center gap-4 p-4 border-b border-slate-50">
          <div className="skeleton w-9 h-9 rounded-full flex-shrink-0"></div>
          {Array.from({ length: cols - 1 }).map((_, col) => (
            <div key={col} className="skeleton h-4 flex-1" style={{ maxWidth: `${80 + Math.random() * 60}px` }}></div>
          ))}
        </div>
      ))}
    </div>
  ),
  cards: ({ count = 4 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 animate-fade-in">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="skeleton w-12 h-12 rounded-xl"></div>
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3 w-20"></div>
              <div className="skeleton h-6 w-14"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
  chart: () => (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm animate-fade-in">
      <div className="skeleton h-5 w-32 mb-6"></div>
      <div className="skeleton h-64 w-full rounded-xl"></div>
    </div>
  ),
  notices: ({ count = 3 }) => (
    <div className="space-y-4 animate-fade-in">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="skeleton h-5 w-48"></div>
          <div className="flex gap-4">
            <div className="skeleton h-3 w-24"></div>
            <div className="skeleton h-3 w-20"></div>
          </div>
          <div className="space-y-2">
            <div className="skeleton h-3 w-full"></div>
            <div className="skeleton h-3 w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  ),
};

const LoadingSkeleton = ({ variant = 'table', ...props }) => {
  const SkeletonVariant = variants[variant];
  if (!SkeletonVariant) return null;
  return <SkeletonVariant {...props} />;
};

export default LoadingSkeleton;
