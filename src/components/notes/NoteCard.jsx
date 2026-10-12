import React, { useState, useRef, useEffect } from 'react';
import {
  Pin,
  MoreVertical,
  Edit2,
  Trash2,
  RotateCcw,
  Tag,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';
import { formatRelativeDate, calculateWordCount } from '../../utils/formatDate.js';

export function NoteCard({
  note,
  onEdit,
  onPinToggle,
  onDelete,
  onRestore,
  onPermanentDelete,
  isTrashView = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const colorBorderMap = {
    default: 'hover:border-brand-300 dark:hover:border-brand-700',
    amber: 'border-t-4 border-t-amber-400 hover:border-amber-400',
    blue: 'border-t-4 border-t-sky-500 hover:border-sky-400',
    emerald: 'border-t-4 border-t-emerald-500 hover:border-emerald-400',
    purple: 'border-t-4 border-t-purple-500 hover:border-purple-400',
    rose: 'border-t-4 border-t-rose-500 hover:border-rose-400',
  };

  const subjectBgMap = {
    indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-800/50',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/50',
    sky: 'bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 border-sky-200/50 dark:border-sky-800/50',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200/50 dark:border-purple-800/50',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200/50 dark:border-rose-800/50',
  };

  const wordCount = calculateWordCount(note.content);

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-subtle hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between cursor-pointer ${
        colorBorderMap[note.color] || colorBorderMap.default
      }`}
      onClick={() => {
        if (!isTrashView && onEdit) {
          onEdit(note);
        }
      }}
    >
      <div>
        {/* Top bar: Subject badge & Pin/Menu actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            {note.subjectId?.name ? (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                  subjectBgMap[note.subjectId.color] || subjectBgMap.indigo
                }`}
              >
                {note.subjectId.name}
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                General
              </span>
            )}
          </div>

          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()} // Stop opening edit modal
          >
            {!isTrashView && (
              <button
                type="button"
                onClick={() => onPinToggle && onPinToggle(note)}
                title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
                className={`p-1.5 rounded-lg transition-colors ${
                  note.isPinned
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60'
                    : 'text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-current' : ''}`} />
              </button>
            )}

            {/* More Options Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Options"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-elevated border border-slate-200 dark:border-slate-800 py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                  {!isTrashView ? (
                    <>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onEdit && onEdit(note);
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Edit Note</span>
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onPinToggle && onPinToggle(note);
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Pin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{note.isPinned ? 'Unpin' : 'Pin to top'}</span>
                      </button>
                      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onDelete && onDelete(note);
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Move to Trash</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onRestore && onRestore(note);
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore Note</span>
                      </button>
                      <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          onPermanentDelete && onPermanentDelete(note);
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Forever</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Note Title */}
        <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {note.title}
        </h4>

        {/* Note Content Preview */}
        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed whitespace-pre-wrap">
          {note.content ? note.content.replace(/#+\s*/g, '') : 'No additional content.'}
        </p>

        {/* Tags Array */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {note.tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 4 && (
              <span className="text-[10px] text-slate-400 self-center">
                +{note.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Metadata timestamps and word count */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{formatRelativeDate(note.updatedAt || note.createdAt)}</span>
        </span>
        <span>{wordCount} words</span>
      </div>
    </div>
  );
}

export default NoteCard;
