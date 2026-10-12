import express from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  togglePinNote,
  deleteNote,
} from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createNoteSchema, updateNoteSchema } from '../validators/noteValidators.js';

const router = express.Router();

router.use(protect); // All note routes require authenticated user

router.get('/', getNotes);
router.get('/:id', getNoteById);
router.post('/', validateRequest(createNoteSchema), createNote);
router.patch('/:id', validateRequest(updateNoteSchema), updateNote);
router.patch('/:id/pin', togglePinNote);
router.delete('/:id', deleteNote);

export default router;
