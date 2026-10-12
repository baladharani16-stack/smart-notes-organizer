import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import NoteGrid from '../components/notes/NoteGrid.jsx';
import noteService from '../services/noteService.js';
import { Clock, Plus } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export function RecentNotesPage() {
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
    async function fetchRecentNotes() {
      setLoading(true);
      try {
        const res = await noteService.getNotes({ sort: 'updated', limit: 20 });
        if (res.success) {
          setNotes(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch recent notes:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentNotes();
  }, [refreshTrigger]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Recently Updated
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Notes you recently revised, supplemented, or studied.
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
        emptyTitle="No recent activity"
        emptyDescription="Your modified or newly created notes will automatically show up here."
        onEmptyAction={onOpenCreateModal}
        emptyActionLabel="Create Note"
      />
    </div>
  );
}

export default RecentNotesPage;
