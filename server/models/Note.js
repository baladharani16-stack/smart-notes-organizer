import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      default: '',
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      default: null,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      set: (tags) => {
        if (!Array.isArray(tags)) return [];
        return [...new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean))];
      },
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    color: {
      type: String,
      default: 'default', // default, amber, blue, emerald, purple, rose
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
noteSchema.index({ userId: 1, deletedAt: 1, isPinned: -1, updatedAt: -1 });
noteSchema.index({ userId: 1, deletedAt: 1, subjectId: 1 });
noteSchema.index({ userId: 1, deletedAt: 1, tags: 1 });
// Text index for search
noteSchema.index({ title: 'text', content: 'text' });

// Virtual for word count
noteSchema.virtual('wordCount').get(function () {
  if (!this.content) return 0;
  return this.content.trim().split(/\s+/).filter(Boolean).length;
});

noteSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
export default Note;
