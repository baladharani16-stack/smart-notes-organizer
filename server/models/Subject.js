import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
      maxlength: [50, 'Subject name cannot exceed 50 characters'],
    },
    color: {
      type: String,
      default: 'indigo', // indigo, violet, sky, emerald, amber, rose, fuchsia
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee uniqueness per user
subjectSchema.index({ userId: 1, name: 1 }, { unique: true });

subjectSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Subject = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);
export default Subject;
