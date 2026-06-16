import express from 'express';
import { submitFeedback, getFeedbacks } from '../controllers/feedbackController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitFeedback);
router.get('/', protect, adminOnly, getFeedbacks);

export default router;
