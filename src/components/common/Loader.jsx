import React from 'react';
import { Loader2 } from 'lucide-react';

export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2
      className={`animate-spin text-brand-600 dark:text-brand-400 ${sizes[size] || sizes.md} ${className}`}
    />
  );
}

export function PageLoader({ text = 'Loading your space...' }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 gap-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center border border-brand-200 dark:border-brand-800 animate-pulse">
          <Spinner size="lg" />
        </div>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {text}
      </p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-subtle animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="h-5 w-5 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/60 rounded" />
        <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-800/60 rounded" />
      </div>
      <div className="flex items-center gap-2 pt-2">
        <div className="h-5 w-14 bg-slate-100 dark:bg-slate-800/70 rounded-md" />
        <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800/70 rounded-md" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-4 w-8 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default Spinner;
