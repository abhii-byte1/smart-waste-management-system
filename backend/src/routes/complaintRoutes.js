import express from 'express';
import {
  createComplaint,
  deleteComplaint,
  getComplaints,
  updateComplaintStatus
} from '../controllers/complaintController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createComplaint).get(protect, getComplaints);
router.route('/:id').put(protect, adminOnly, updateComplaintStatus).delete(protect, adminOnly, deleteComplaint);

export default router;
