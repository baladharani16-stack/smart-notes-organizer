import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import NoteGrid from '../components/notes/NoteGrid.jsx';
import noteService from '../services/noteService.js';
import { Pin, Plus } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export function PinnedNotesPage() {
  const {
    refreshTrigger,
    onOpenCreateModal,
    onEditNote,
    onPinToggle,
    onDeleteNote,
  } = useOutletContext();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPinnedNotes() {
      setLoading(true);
      try {
        const res = await noteService.getNotes({ isPinned: true });
        if (res.success) {
          setNotes(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch pinned notes:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPinnedNotes();
  }, [refreshTrigger]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Pin className="w-5 h-5 text-amber-500 fill-current" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Pinned Notes
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Keep your highest-priority study topics, cheat sheets, and active exam summaries pinned to top.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onOpenCreateModal}
          icon={Plus}
        >
          Create Note
        </Button>
      </div>

      <NoteGrid
        notes={notes}
        loading={loading}
        onEdit={onEditNote}
        onPinToggle={onPinToggle}
        onDelete={onDeleteNote}
        emptyTitle="No pinned notes"
        emptyDescription="Pin important notes by clicking the pin icon on any note card to keep them handy here."
        onEmptyAction={onOpenCreateModal}
        emptyActionLabel="Create Note"
      />
    </div>
  );
}

export default PinnedNotesPage;
