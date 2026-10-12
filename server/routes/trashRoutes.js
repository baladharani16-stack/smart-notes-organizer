import express from 'express';
import {
  getTrashNotes,
  restoreNote,
  permanentDeleteNote,
  emptyTrash,
} from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All trash operations require authentication

router.get('/', getTrashNotes);
router.patch('/:id/restore', restoreNote);
router.delete('/:id/permanent', permanentDeleteNote);
router.delete('/empty', emptyTrash);

export default router;
