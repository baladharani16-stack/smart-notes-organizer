import express from 'express';
import { getDashboardStats, seedDemoData } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.post('/seed', seedDemoData);

export default router;
