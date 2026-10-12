import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z
    .string({ required_error: 'Note title is required' })
    .trim()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title cannot exceed 200 characters'),
  content: z.string().optional().default(''),
  subjectId: z.string().nullable().optional(),
  tags: z.array(z.string()).optional().default([]),
  isPinned: z.boolean().optional().default(false),
  color: z.enum(['default', 'amber', 'blue', 'emerald', 'purple', 'rose']).optional().default('default'),
});

export const updateNoteSchema = createNoteSchema.partial();

export const subjectSchema = z.object({
  name: z
    .string({ required_error: 'Subject name is required' })
    .min(1, 'Subject name cannot be empty')
    .max(50, 'Subject name cannot exceed 50 characters')
    .trim(),
  color: z.string().optional().default('indigo'),
  description: z.string().max(200, 'Description cannot exceed 200 characters').optional().default(''),
});
