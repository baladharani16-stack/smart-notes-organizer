import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  FolderOpen,
  Plus,
  Edit2,
  Trash2,
  FileText,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import subjectService from '../services/subjectService.js';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';
import Input from '../components/common/Input.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { Spinner } from '../components/common/Loader.jsx';

export function SubjectsPage() {
  const { refreshTrigger, showToast, loadSubjects } = useOutletContext();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subject modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('indigo');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await subjectService.getSubjects();
      if (res.success) {
        setSubjects(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [refreshTrigger]);

  const handleOpenCreateModal = () => {
    setEditingSubject(null);
    setName('');
    setColor('indigo');
    setDescription('');
    setError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (sub) => {
    setEditingSubject(sub);
    setName(sub.name);
    setColor(sub.color || 'indigo');
    setDescription(sub.description || '');
    setError('');
    setModalOpen(true);
  };

  const handleSaveSubject = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Subject name is required.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      if (editingSubject) {
        await subjectService.updateSubject(editingSubject._id, {
          name: name.trim(),
          color,
          description: description.trim(),
        });
        showToast('Subject updated successfully!');
      } else {
        await subjectService.createSubject({
          name: name.trim(),
          color,
          description: description.trim(),
        });
        showToast('Subject created successfully!');
      }
      setModalOpen(false);
      fetchSubjects();
      loadSubjects();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save subject');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePromptDelete = (sub) => {
    setSubjectToDelete(sub);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!subjectToDelete) return;
    setDeleting(true);
    try {
      await subjectService.deleteSubject(subjectToDelete._id);
      showToast('Subject deleted. Associated notes unlinked.');
      setDeleteModalOpen(false);
      setSubjectToDelete(null);
      fetchSubjects();
      loadSubjects();
    } catch (err) {
      showToast('Failed to delete subject', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const colors = [
    { id: 'indigo', name: 'Indigo', bg: 'bg-indigo-500' },
    { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-500' },
    { id: 'amber', name: 'Amber', bg: 'bg-amber-500' },
    { id: 'sky', name: 'Sky', bg: 'bg-sky-500' },
    { id: 'purple', name: 'Purple', bg: 'bg-purple-500' },
    { id: 'rose', name: 'Rose', bg: 'bg-rose-500' },
  ];

  const colorBorderMap = {
    indigo: 'border-l-indigo-500',
    emerald: 'border-l-emerald-500',
    amber: 'border-l-amber-500',
    sky: 'border-l-sky-500',
    purple: 'border-l-purple-500',
    rose: 'border-l-rose-500',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Subjects & Categories
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize notes systematically by courses, certifications, or tech disciplines.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreateModal}
          icon={Plus}
        >
          Add Subject
        </Button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : subjects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No subjects created"
          description="Create custom subjects to organize your notes into structured categories."
          actionLabel="Create Subject"
          onAction={handleOpenCreateModal}
          actionIcon={Plus}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((sub) => (
            <div
              key={sub._id}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-subtle hover:shadow-card-hover transition-all duration-150 border-l-4 ${
                colorBorderMap[sub.color] || colorBorderMap.indigo
              } flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {sub.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(sub)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit Subject"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handlePromptDelete(sub)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title="Delete Subject"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[32px]">
                  {sub.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{sub.noteCount ?? 0} notes</span>
                </span>

                <button
                  onClick={() => navigate(`/app/notes?subject=${sub._id}`)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <span>Browse notes</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Subject Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSubject ? 'Edit Subject' : 'Create New Subject'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveSubject} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <Input
            label="Subject Name"
            placeholder="e.g. Distributed Systems"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Color Theme
            </label>
            <div className="flex items-center gap-2">
              {colors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  title={c.name}
                  className={`w-7 h-7 rounded-xl ${c.bg} transition-all ${
                    color === c.id
                      ? 'ring-2 ring-offset-2 ring-brand-500 scale-110 shadow-subtle'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of this subject or course topics..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={submitting}
            >
              {editingSubject ? 'Save Changes' : 'Create Subject'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Subject Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Subject?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-white">"{subjectToDelete?.name}"</span>?
            Notes assigned to this subject will not be deleted; their subject will simply be cleared to General.
          </p>

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
              onClick={handleConfirmDelete}
              isLoading={deleting}
            >
              Delete Subject
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default SubjectsPage;
