import mongoose from 'mongoose';
import Note from '../models/Note.js';
import Subject from '../models/Subject.js';

/**
 * Get comprehensive dashboard statistics for current user
 * GET /api/dashboard/stats
 */
export async function getDashboardStats(req, res, next) {
  try {
    const userId = req.user._id;

    const [
      totalNotes,
      pinnedNotes,
      trashCount,
      totalSubjects,
      recentNotes,
      subjects,
    ] = await Promise.all([
      Note.countDocuments({ userId, deletedAt: null }),
      Note.countDocuments({ userId, deletedAt: null, isPinned: true }),
      Note.countDocuments({ userId, deletedAt: { $ne: null } }),
      Subject.countDocuments({ userId }),
      Note.find({ userId, deletedAt: null })
        .sort({ updatedAt: -1 })
        .limit(6)
        .populate('subjectId', 'name color')
        .lean({ virtuals: true }),
      Subject.find({ userId }).sort({ name: 1 }).lean(),
    ]);

    // Aggregate tags distribution
    const tagsAggregate = await Note.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), deletedAt: null } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const popularTags = tagsAggregate.map((t) => ({ tag: t._id, count: t.count }));

    // Calculate total word count across notes
    const wordCountAggregate = await Note.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), deletedAt: null } },
      {
        $project: {
          wordCount: {
            $size: {
              $split: [{ $trim: { input: '$content' } }, ' '],
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalWords: { $sum: '$wordCount' },
        },
      },
    ]);

    const totalWords = wordCountAggregate[0]?.totalWords || 0;

    return res.status(200).json({
      success: true,
      data: {
        totalNotes,
        pinnedNotes,
        trashCount,
        totalSubjects,
        totalWords,
        recentNotes,
        popularTags,
        subjectsCount: subjects.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Seed realistic sample notes and subjects for development or demonstration
 * POST /api/dashboard/seed
 */
export async function seedDemoData(req, res, next) {
  try {
    const userId = req.user._id;

    // Retrieve or create standard subjects
    let subjects = await Subject.find({ userId });
    if (subjects.length === 0) {
      subjects = await Subject.insertMany([
        { userId, name: 'Programming', color: 'indigo', description: 'Core languages & algorithm concepts' },
        { userId, name: 'Database', color: 'emerald', description: 'MongoDB, PostgreSQL, queries & indexing' },
        { userId, name: 'Cloud Computing', color: 'sky', description: 'Serverless, Docker, Vercel & microservices' },
        { userId, name: 'Interview Prep', color: 'purple', description: 'System design, behavioral & coding puzzles' },
      ]);
    }

    const progSub = subjects.find((s) => s.name === 'Programming') || subjects[0];
    const dbSub = subjects.find((s) => s.name === 'Database') || subjects[1] || subjects[0];
    const cloudSub = subjects.find((s) => s.name === 'Cloud Computing') || subjects[2] || subjects[0];
    const prepSub = subjects.find((s) => s.name === 'Interview Prep') || subjects[3] || subjects[0];

    // Create sample notes
    const sampleNotes = [
      {
        userId,
        title: 'Mastering React 18 Concurrent Rendering',
        content: `Key Takeaways:\n- useTransition allows marking UI updates as non-urgent.\n- useDeferredValue lets you defer re-rendering a non-urgent part of the screen.\n- Suspense boundaries provide graceful fallback loading spinners.\n- Automatic batching combines state updates even inside async calls and setTimeout!`,
        subjectId: progSub?._id,
        tags: ['react', 'javascript', 'frontend', 'performance'],
        isPinned: true,
        color: 'blue',
      },
      {
        userId,
        title: 'MongoDB Indexing Strategies & Compound Indexes',
        content: `Best practices for query optimization:\n1. The ESR rule: Equality, Sort, Range. Place equality fields first in the compound index, followed by sort fields, and finally range filters.\n2. Use explain("executionStats") to monitor totalDocsExamined vs nReturned.\n3. Always index foreign keys like userId to prevent full collection scans.`,
        subjectId: dbSub?._id,
        tags: ['mongodb', 'nosql', 'performance', 'database'],
        isPinned: true,
        color: 'emerald',
      },
      {
        userId,
        title: 'Vercel Serverless Function Lifecycle & Connection Pooling',
        content: `When deploying Express onto Vercel Serverless Functions:\n- Functions are stateless and spin up on-demand.\n- Reuse database connection promises globally on global.mongoose to avoid running out of connection pools.\n- Avoid synchronous disk writes; stream or use cloud object storage.\n- Keep function cold boot overhead minimal by avoiding unused heavy packages.`,
        subjectId: cloudSub?._id,
        tags: ['vercel', 'serverless', 'devops', 'express'],
        isPinned: false,
        color: 'sky',
      },
      {
        userId,
        title: 'System Design: Designing a Scalable URL Shortener',
        content: `Step-by-step checklist:\n- Requirement clarifications: 100M URLs generated per month, 10:1 read-to-write ratio.\n- Base62 encoding for hash output (6-7 characters = billions of URLs).\n- Caching layer using Redis with LRU eviction for hot links.\n- Rate limiting per IP/user using Token Bucket algorithm.`,
        subjectId: prepSub?._id,
        tags: ['system-design', 'interview', 'architecture'],
        isPinned: false,
        color: 'purple',
      },
    ];

    const inserted = await Note.insertMany(sampleNotes);

    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${inserted.length} sample notes with subjects and tags!`,
      count: inserted.length,
    });
  } catch (error) {
    next(error);
  }
}
