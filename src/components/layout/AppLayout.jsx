import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import MobileNavigation from './MobileNavigation.jsx';
import NoteEditor from '../notes/NoteEditor.jsx';
import DeleteNoteDialog from '../notes/DeleteNoteDialog.jsx';
import noteService from '../../services/noteService.js';
import subjectService from '../../services/subjectService.js';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Note editor modal state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  const location = useLocation();
  const navigate = useNavigate();

  // Load subjects for filters and editor
  const loadSubjects = async () => {
    try {
      const res = await subjectService.getSubjects();
      if (res.success) {
        setSubjects(res.data);
      }
    } catch (err) {
      console.warn('Could not load subjects:', err.message);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, [refreshTrigger]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleOpenCreateModal = () => {
    setEditingNote(null);
    setEditorOpen(true);
  };

  const handleOpenEditModal = (note) => {
    setEditingNote(note);
    setEditorOpen(true);
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
        await noteService.updateNote(editingNote._id, noteData);
        showToast('Note updated successfully!');
      } else {
        await noteService.createNote(noteData);
        showToast('Note created successfully!');
      }
      setRefreshTrigger((prev) => prev + 1);
      setEditorOpen(false);
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Failed to save note', 'error');
      throw err;
    }
  };

  const handlePinToggle = async (note) => {
    try {
      await noteService.togglePin(note._id, !note.isPinned);
      showToast(note.isPinned ? 'Note unpinned' : 'Note pinned to top');
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      showToast('Failed to update pin status', 'error');
    }
  };

  const handlePromptDelete = (note) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    setIsDeleting(true);
    try {
      await noteService.deleteNote(noteToDelete._id);
      showToast('Note moved to Trash');
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      showToast('Failed to delete note', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateSubject = async (subjectData) => {
    const res = await subjectService.createSubject(subjectData);
    if (res.success) {
      showToast(`Subject "${res.data.name}" created!`);
      await loadSubjects();
      return res.data;
    }
    throw new Error(res.message || 'Failed to create subject');
  };

  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark transition-colors duration-200">
      {/* Desktop Fixed Sidebar */}
      <Sidebar onOpenCreateModal={handleOpenCreateModal} />

      {/* Mobile Drawer */}
      <MobileNavigation
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleMobileNav={() => setMobileNavOpen(true)}
          onOpenCreateModal={handleOpenCreateModal}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet
            context={{
              globalSearch,
              subjects,
              refreshTrigger,
              triggerRefresh: () => setRefreshTrigger((prev) => prev + 1),
              onOpenCreateModal: handleOpenCreateModal,
              onEditNote: handleOpenEditModal,
              onPinToggle: handlePinToggle,
              onDeleteNote: handlePromptDelete,
              showToast,
              loadSubjects,
            }}
          />
        </main>
      </div>

      {/* Global Note Create / Edit Modal */}
      <NoteEditor
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveNote}
        note={editingNote}
        subjects={subjects}
        onCreateSubject={handleCreateSubject}
      />

      {/* Global Delete Confirmation Dialog */}
      <DeleteNoteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Move to Trash?"
        description={`Are you sure you want to move "${noteToDelete?.title || 'this note'}" to the Trash? You can restore it anytime.`}
        confirmLabel="Move to Trash"
        isLoading={isDeleting}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-elevated bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs sm:text-sm font-medium animate-in slide-in-from-bottom-5 duration-200">
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-slate-400 hover:text-white dark:hover:text-slate-900"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default AppLayout;
