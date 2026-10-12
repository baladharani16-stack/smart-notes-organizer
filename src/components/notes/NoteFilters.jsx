import React from 'react';
import { Filter, ArrowUpDown, Tag, FolderOpen, X } from 'lucide-react';

export function NoteFilters({
  subjects = [],
  selectedSubject,
  onSubjectChange,
  selectedSort,
  onSortChange,
  selectedTag,
  onTagChange,
  onClearFilters,
}) {
  const hasActiveFilters = Boolean(selectedSubject || selectedTag || selectedSort !== 'updated');

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-subtle mb-6">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Subject Filter */}
        <div className="relative">
          <select
            value={selectedSubject || ''}
            onChange={(e) => onSubjectChange(e.target.value || null)}
            className="pl-8 pr-7 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name} {sub.noteCount !== undefined ? `(${sub.noteCount})` : ''}
              </option>
            ))}
          </select>
          <FolderOpen className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Tag Indicator Filter if tag is selected */}
        {selectedTag && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-medium">
            <Tag className="w-3 h-3" />
            <span>#{selectedTag}</span>
            <button
              onClick={() => onTagChange(null)}
              className="hover:text-rose-600 transition-colors ml-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors px-2 py-1"
          >
            <X className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Sorting Selector */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            value={selectedSort || 'updated'}
            onChange={(e) => onSortChange(e.target.value)}
            className="pl-8 pr-7 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all appearance-none cursor-pointer"
          >
            <option value="updated">Recently Updated</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alpha">Alphabetical (A-Z)</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

export default NoteFilters;
