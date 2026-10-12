import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import {
  Pin,
  Tag,
  FolderOpen,
  Palette,
  Clock,
  Sparkles,
  X,
  Plus,
  Check,
} from 'lucide-react';
import { calculateWordCount, estimateReadingTime } from '../../utils/formatDate.js';

export function NoteEditor({
  isOpen,
  onClose,
  onSave,
  note = null, // if null => Create mode, otherwise Edit mode
  subjects = [],
  onCreateSubject,
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [color, setColor] = useState('default');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Quick subject create state
  const [showNewSubject, setShowNewSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  // Sync state whenever modal opens or note prop changes
  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setSubjectId(note.subjectId?._id || note.subjectId || '');
      setTags(note.tags || []);
      setIsPinned(Boolean(note.isPinned));
      setColor(note.color || 'default');
    } else {
      setTitle('');
      setContent('');
      setSubjectId('');
      setTags([]);
      setIsPinned(false);
      setColor('default');
    }
    setTagInput('');
    setError('');
    setShowNewSubject(false);
  }, [note, isOpen]);

  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const cleanTag = tagInput.trim().toLowerCase().replace(/^[#,\s]+|[#,\s]+$/g, '');
      if (cleanTag && !tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleCreateSubjectQuick = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim() || !onCreateSubject) return;
    try {
      const created = await onCreateSubject({ name: newSubjectName.trim(), color: 'indigo' });
      if (created?._id) {
        setSubjectId(created._id);
      }
      setNewSubjectName('');
      setShowNewSubject(false);
    } catch (err) {
      setError(err.message || 'Failed to create subject');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Note title is required.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        subjectId: subjectId || null,
        tags,
        isPinned,
        color,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const wordCount = calculateWordCount(content);
  const readingTime = estimateReadingTime(content);

  const colors = [
    { id: 'default', label: 'Default', bg: 'bg-brand-500' },
    { id: 'blue', label: 'Sky', bg: 'bg-sky-500' },
    { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500' },
    { id: 'amber', label: 'Amber', bg: 'bg-amber-500' },
    { id: 'purple', label: 'Purple', bg: 'bg-purple-500' },
    { id: 'rose', label: 'Rose', bg: 'bg-rose-500' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={note ? 'Edit Note' : 'Create New Note'}
      subtitle={note ? `Last modified ${new Date().toLocaleDateString()}` : 'Organize your knowledge in StudySpace'}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Note Title */}
        <div>
          <input
            type="text"
            placeholder="Note title (e.g., Operating Systems: Process Scheduling Algorithms)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-lg sm:text-xl font-bold bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border-none outline-none focus:ring-0 p-0"
            autoFocus
          />
        </div>

        {/* Metadata Controls Bar: Subject, Pin, Color */}
        <div className="flex flex-wrap items-center gap-3 pt-2 pb-2 border-y border-slate-100 dark:border-slate-800">
          {/* Subject Dropdown */}
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-slate-400" />
            <select
              value={subjectId}
              onChange={(e) => {
                if (e.target.value === '__new__') {
                  setShowNewSubject(true);
                } else {
                  setSubjectId(e.target.value);
                }
              }}
              className="py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">No Subject (General)</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
              <option value="__new__">+ Add New Subject</option>
            </select>
          </div>

          {/* Quick subject creation input */}
          {showNewSubject && (
            <div className="flex items-center gap-1.5 animate-in fade-in duration-100">
              <input
                type="text"
                placeholder="Subject name"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="py-1 px-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCreateSubjectQuick}
                className="p-1 rounded-lg bg-brand-600 text-white text-xs hover:bg-brand-700"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setShowNewSubject(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Pin Toggle */}
          <button
            type="button"
            onClick={() => setIsPinned(!isPinned)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              isPinned
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
            <span>{isPinned ? 'Pinned' : 'Pin to Top'}</span>
          </button>

          {/* Accent Color Chooser */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[11px] text-slate-400 font-medium">Accent:</span>
            {colors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColor(c.id)}
                title={c.label}
                className={`w-5 h-5 rounded-full ${c.bg} transition-transform ${
                  color === c.id ? 'ring-2 ring-offset-2 ring-brand-500 scale-110' : 'opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Note Content Textarea */}
        <div>
          <textarea
            rows={12}
            placeholder="Type your notes, code snippets, key concepts, formulas, or summaries here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 leading-relaxed font-mono sm:font-sans transition-all resize-y"
          />
        </div>

        {/* Tags management */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Tags
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-rose-600 transition-colors ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add tag (press Enter or comma)..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="flex-1 min-w-[140px] text-xs bg-transparent border-none outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 p-1"
            />
          </div>
        </div>

        {/* Footer Actions & Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{readingTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={saving}
              icon={Check}
            >
              {note ? 'Save Changes' : 'Create Note'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default NoteEditor;
