import React from 'react';
import NoteCard from './NoteCard.jsx';
import { SkeletonGrid } from '../common/Loader.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { FilePlus2 } from 'lucide-react';

export function NoteGrid({
  notes = [],
  loading = false,
  onEdit,
  onPinToggle,
  onDelete,
  onRestore,
  onPermanentDelete,
  isTrashView = false,
  emptyTitle = 'No notes found',
  emptyDescription = 'Create your first note to begin organizing your thoughts and study material.',
  onEmptyAction,
  emptyActionLabel = 'Create Note',
}) {
  if (loading) {
    return <SkeletonGrid count={6} />;
  }

  if (!notes || notes.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={onEmptyAction ? emptyActionLabel : undefined}
        onAction={onEmptyAction}
        actionIcon={FilePlus2}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {notes.map((note) => (
        <NoteCard
          key={note._id}
          note={note}
          onEdit={onEdit}
          onPinToggle={onPinToggle}
          onDelete={onDelete}
          onRestore={onRestore}
          onPermanentDelete={onPermanentDelete}
          isTrashView={isTrashView}
        />
      ))}
    </div>
  );
}

export default NoteGrid;
