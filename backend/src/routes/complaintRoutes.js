import express from 'express';
import {
  createComplaint,
  deleteComplaint,
  getComplaintStats,
  getComplaints,
  updateComplaintStatus
} from '../controllers/complaintController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, adminOnly, getComplaintStats);
router.route('/').post(protect, createComplaint).get(protect, getComplaints);
router.route('/:id').put(protect, adminOnly, updateComplaintStatus).delete(protect, adminOnly, deleteComplaint);

export default router;
