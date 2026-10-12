import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import NoteGrid from '../components/notes/NoteGrid.jsx';
import NoteFilters from '../components/notes/NoteFilters.jsx';
import noteService from '../services/noteService.js';
import useDebounce from '../hooks/useDebounce.js';
import { FileText, Plus } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export function AllNotesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    globalSearch,
    subjects,
    refreshTrigger,
    onOpenCreateModal,
    onEditNote,
    onPinToggle,
    onDeleteNote,
  } = useOutletContext();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || null);
  const [selectedSort, setSelectedSort] = useState('updated');
  const [totalCount, setTotalCount] = useState(0);

  // Debounce the search input
  const activeSearch = searchParams.get('search') || globalSearch || '';
  const debouncedSearch = useDebounce(activeSearch, 300);

  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      try {
        const params = {
          sort: selectedSort,
          search: debouncedSearch || undefined,
          subjectId: selectedSubject || undefined,
          tag: selectedTag || undefined,
        };

        const res = await noteService.getNotes(params);
        if (res.success) {
          setNotes(res.data);
          setTotalCount(res.pagination?.totalCount ?? res.data.length);
        }
      } catch (err) {
        console.error('Failed to fetch notes:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [debouncedSearch, selectedSubject, selectedTag, selectedSort, refreshTrigger]);

  const handleClearFilters = () => {
    setSelectedSubject('');
    setSelectedTag(null);
    setSelectedSort('updated');
    setSearchParams({});
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              All Notes
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse, search, and filter your entire repository of {totalCount} active notes.
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

      {/* Filters Bar */}
      <NoteFilters
        subjects={subjects}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        onClearFilters={handleClearFilters}
      />

      {/* Grid */}
      <NoteGrid
        notes={notes}
        loading={loading}
        onEdit={onEditNote}
        onPinToggle={onPinToggle}
        onDelete={onDeleteNote}
        emptyTitle={debouncedSearch || selectedSubject || selectedTag ? 'No matching notes found' : 'No notes created yet'}
        emptyDescription={
          debouncedSearch || selectedSubject || selectedTag
            ? 'Try adjusting your search keywords, clearing subject filters, or removing the tag filter.'
            : 'Click the button below to write your first note!'
        }
        onEmptyAction={onOpenCreateModal}
        emptyActionLabel="Write a Note"
      />
    </div>
  );
}

export default AllNotesPage;
