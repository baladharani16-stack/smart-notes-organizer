import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import NoteGrid from '../components/notes/NoteGrid.jsx';
import noteService from '../services/noteService.js';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';

export function TrashPage() {
  const { refreshTrigger, showToast, triggerRefresh } = useOutletContext();
  const [trashNotes, setTrashNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Permanent delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Empty trash modal state
  const [emptyModalOpen, setEmptyModalOpen] = useState(false);
  const [emptying, setEmptying] = useState(false);

  const fetchTrash = async () => {
    try {
      setLoading(true);
      const res = await noteService.getTrashNotes();
      if (res.success) {
        setTrashNotes(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch trash notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, [refreshTrigger]);

  const handleRestore = async (note) => {
    try {
      await noteService.restoreNote(note._id);
      showToast(`Note "${note.title}" restored!`);
      fetchTrash();
      triggerRefresh();
    } catch (err) {
      showToast('Failed to restore note', 'error');
    }
  };

  const handlePromptPermanentDelete = (note) => {
    setNoteToDelete(note);
    setDeleteModalOpen(true);
  };

  const handleConfirmPermanentDelete = async () => {
    if (!noteToDelete) return;
    setDeleting(true);
    try {
      await noteService.permanentDeleteNote(noteToDelete._id);
      showToast('Note permanently deleted.');
      setDeleteModalOpen(false);
      setNoteToDelete(null);
      fetchTrash();
      triggerRefresh();
    } catch (err) {
      showToast('Failed to permanently delete note', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleConfirmEmptyTrash = async () => {
    setEmptying(true);
    try {
      const res = await noteService.emptyTrash();
      showToast(res.message || 'Trash emptied.');
      setEmptyModalOpen(false);
      fetchTrash();
      triggerRefresh();
    } catch (err) {
      showToast('Failed to empty trash', 'error');
    } finally {
      setEmptying(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Trash
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Notes moved to Trash stay here until you restore or permanently remove them.
          </p>
        </div>

        {trashNotes.length > 0 && (
          <Button
            variant="dangerOutline"
            size="sm"
            onClick={() => setEmptyModalOpen(true)}
            icon={Trash2}
          >
            Empty Trash
          </Button>
        )}
      </div>

      <NoteGrid
        notes={trashNotes}
        loading={loading}
        onRestore={handleRestore}
        onPermanentDelete={handlePromptPermanentDelete}
        isTrashView={true}
        emptyTitle="Trash is empty"
        emptyDescription="Deleted notes will appear here. No junk files taking up space!"
      />

      {/* Confirmation Modal for Single Permanent Delete */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Permanently Delete Note?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                "{noteToDelete?.title}"
              </span>
              ? This action cannot be undone.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmPermanentDelete}
              isLoading={deleting}
            >
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal for Empty Trash */}
      <Modal
        isOpen={emptyModalOpen}
        onClose={() => setEmptyModalOpen(false)}
        title="Empty Entire Trash?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              This will permanently delete all {trashNotes.length} notes currently in your Trash.
              This operation is irreversible.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEmptyModalOpen(false)}
              disabled={emptying}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmEmptyTrash}
              isLoading={emptying}
            >
              Yes, Empty Trash
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TrashPage;
