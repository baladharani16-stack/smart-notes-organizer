import mongoose from 'mongoose';
import Subject from '../models/Subject.js';
import Note from '../models/Note.js';

/**
 * Get all subjects for current user with active note counts
 * GET /api/subjects
 */
export async function getSubjects(req, res, next) {
  try {
    const subjects = await Subject.find({ userId: req.user._id }).sort({ name: 1 }).lean();

    // Calculate active note counts per subject
    const noteCounts = await Note.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          deletedAt: null,
          subjectId: { $ne: null },
        },
      },
      {
        $group: {
          _id: '$subjectId',
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = {};
    noteCounts.forEach((item) => {
      countMap[item._id.toString()] = item.count;
    });

    const enrichedSubjects = subjects.map((sub) => ({
      ...sub,
      noteCount: countMap[sub._id.toString()] || 0,
    }));

    return res.status(200).json({
      success: true,
      data: enrichedSubjects,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new subject
 * POST /api/subjects
 */
export async function createSubject(req, res, next) {
  try {
    const { name, color, description } = req.body;

    const existing = await Subject.findOne({
      userId: req.user._id,
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A subject named "${name.trim()}" already exists.`,
      });
    }

    const subject = await Subject.create({
      userId: req.user._id,
      name: name.trim(),
      color: color || 'indigo',
      description: description || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: { ...subject.toJSON(), noteCount: 0 },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update an existing subject
 * PATCH /api/subjects/:id
 */
export async function updateSubject(req, res, next) {
  try {
    const { id } = req.params;
    const { name, color, description } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid subject ID format' });
    }

    const subject = await Subject.findOne({ _id: id, userId: req.user._id });
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    if (name && name.trim().toLowerCase() !== subject.name.toLowerCase()) {
      const existing = await Subject.findOne({
        userId: req.user._id,
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: `Another subject named "${name.trim()}" already exists.`,
        });
      }
      subject.name = name.trim();
    }

    if (color !== undefined) subject.color = color;
    if (description !== undefined) subject.description = description;

    await subject.save();

    const noteCount = await Note.countDocuments({
      userId: req.user._id,
      subjectId: subject._id,
      deletedAt: null,
    });

    return res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: { ...subject.toJSON(), noteCount },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a subject
 * DELETE /api/subjects/:id
 */
export async function deleteSubject(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid subject ID format' });
    }

    const subject = await Subject.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    // Safely unset subjectId on associated notes
    await Note.updateMany(
      { userId: req.user._id, subjectId: id },
      { $set: { subjectId: null } }
    );

    return res.status(200).json({
      success: true,
      message: 'Subject deleted successfully and associated notes updated.',
    });
  } catch (error) {
    next(error);
  }
}
