import express from 'express';
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from '../controllers/subjectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { subjectSchema } from '../validators/noteValidators.js';

const router = express.Router();

router.use(protect); // All subject operations require authentication

router.get('/', getSubjects);
router.post('/', validateRequest(subjectSchema), createSubject);
router.patch('/:id', validateRequest(subjectSchema.partial()), updateSubject);
router.delete('/:id', deleteSubject);

export default router;
