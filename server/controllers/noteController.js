import mongoose from 'mongoose';
import Note from '../models/Note.js';
import Subject from '../models/Subject.js';

/**
 * Get all active notes for current user
 * GET /api/notes
 */
export async function getNotes(req, res, next) {
  try {
    const {
      search,
      subjectId,
      tag,
      isPinned,
      sort = 'updated',
      page = 1,
      limit = 50,
    } = req.query;

    const query = {
      userId: req.user._id,
      deletedAt: null,
    };

    // Filter by subject
    if (subjectId) {
      if (mongoose.isValidObjectId(subjectId)) {
        query.subjectId = subjectId;
      }
    }

    // Filter by tag
    if (tag) {
      query.tags = tag.toLowerCase().trim();
    }

    // Filter by pinned state
    if (isPinned !== undefined) {
      query.isPinned = isPinned === 'true' || isPinned === true;
    }

    // Search query across title, content, and tags
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Sorting
    let sortObj = { isPinned: -1, updatedAt: -1 };
    switch (sort) {
      case 'newest':
        sortObj = { isPinned: -1, createdAt: -1 };
        break;
      case 'oldest':
        sortObj = { isPinned: -1, createdAt: 1 };
        break;
      case 'alpha':
        sortObj = { isPinned: -1, title: 1 };
        break;
      case 'updated':
      default:
        sortObj = { isPinned: -1, updatedAt: -1 };
        break;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [notes, totalCount, pinnedCount] = await Promise.all([
      Note.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .populate('subjectId', 'name color')
        .lean({ virtuals: true }),
      Note.countDocuments(query),
      Note.countDocuments({ userId: req.user._id, deletedAt: null, isPinned: true }),
    ]);

    return res.status(200).json({
      success: true,
      data: notes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
      },
      pinnedCount,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single note by ID
 * GET /api/notes/:id
 */
export async function getNoteById(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid note ID format' });
    }

    const note = await Note.findOne({
      _id: id,
      userId: req.user._id,
      deletedAt: null,
    }).populate('subjectId', 'name color');

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    return res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new note
 * POST /api/notes
 */
export async function createNote(req, res, next) {
  try {
    const { title, content, subjectId, tags, isPinned, color } = req.body;

    // Verify subject ownership if subjectId is supplied
    if (subjectId) {
      if (!mongoose.isValidObjectId(subjectId)) {
        return res.status(400).json({ success: false, message: 'Invalid subject ID' });
      }
      const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
      if (!subject) {
        return res.status(400).json({ success: false, message: 'Selected subject does not exist or does not belong to you.' });
      }
    }

    const note = await Note.create({
      userId: req.user._id,
      title,
      content: content || '',
      subjectId: subjectId || null,
      tags: tags || [],
      isPinned: Boolean(isPinned),
      color: color || 'default',
    });

    const populatedNote = await Note.findById(note._id).populate('subjectId', 'name color');

    return res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: populatedNote,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update a note
 * PATCH /api/notes/:id
 */
export async function updateNote(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content, subjectId, tags, isPinned, color } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid note ID format' });
    }

    const note = await Note.findOne({ _id: id, userId: req.user._id, deletedAt: null });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found or has been moved to trash.' });
    }

    if (subjectId !== undefined) {
      if (subjectId) {
        if (!mongoose.isValidObjectId(subjectId)) {
          return res.status(400).json({ success: false, message: 'Invalid subject ID' });
        }
        const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
        if (!subject) {
          return res.status(400).json({ success: false, message: 'Subject not found or does not belong to you.' });
        }
        note.subjectId = subjectId;
      } else {
        note.subjectId = null;
      }
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = Boolean(isPinned);
    if (color !== undefined) note.color = color;

    await note.save();

    const updatedNote = await Note.findById(note._id).populate('subjectId', 'name color');

    return res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: updatedNote,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Toggle or set note pin status
 * PATCH /api/notes/:id/pin
 */
export async function togglePinNote(req, res, next) {
  try {
    const { id } = req.params;
    const { isPinned } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid note ID format' });
    }

    const note = await Note.findOne({ _id: id, userId: req.user._id, deletedAt: null });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    note.isPinned = isPinned !== undefined ? Boolean(isPinned) : !note.isPinned;
    await note.save();

    return res.status(200).json({
      success: true,
      message: note.isPinned ? 'Note pinned' : 'Note unpinned',
      data: note,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Move note to Trash (soft delete)
 * DELETE /api/notes/:id
 */
export async function deleteNote(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid note ID format' });
    }

    const note = await Note.findOne({ _id: id, userId: req.user._id, deletedAt: null });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found or already deleted.' });
    }

    note.deletedAt = new Date();
    await note.save();

    return res.status(200).json({
      success: true,
      message: 'Note moved to Trash',
      data: { _id: note._id, deletedAt: note.deletedAt },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get notes in Trash
 * GET /api/trash
 */
export async function getTrashNotes(req, res, next) {
  try {
    const trashNotes = await Note.find({
      userId: req.user._id,
      deletedAt: { $ne: null },
    })
      .sort({ deletedAt: -1 })
      .populate('subjectId', 'name color')
      .lean({ virtuals: true });

    return res.status(200).json({
      success: true,
      data: trashNotes,
      totalCount: trashNotes.length,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Restore note from Trash
 * PATCH /api/trash/:id/restore
 */
export async function restoreNote(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid note ID format' });
    }

    const note = await Note.findOne({ _id: id, userId: req.user._id, deletedAt: { $ne: null } });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found in trash.' });
    }

    note.deletedAt = null;
    await note.save();

    const restoredNote = await Note.findById(note._id).populate('subjectId', 'name color');

    return res.status(200).json({
      success: true,
      message: 'Note restored successfully',
      data: restoredNote,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Permanently delete note from Trash
 * DELETE /api/trash/:id/permanent
 */
export async function permanentDeleteNote(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid note ID format' });
    }

    const note = await Note.findOneAndDelete({
      _id: id,
      userId: req.user._id,
      deletedAt: { $ne: null },
    });

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found in trash.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Note permanently deleted',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Empty entire Trash for current user
 * DELETE /api/trash/empty
 */
export async function emptyTrash(req, res, next) {
  try {
    const result = await Note.deleteMany({
      userId: req.user._id,
      deletedAt: { $ne: null },
    });

    return res.status(200).json({
      success: true,
      message: `Trash emptied (${result.deletedCount} notes permanently deleted)`,
    });
  } catch (error) {
    next(error);
  }
}
