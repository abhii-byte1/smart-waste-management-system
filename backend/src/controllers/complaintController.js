import Complaint from '../models/Complaint.js';
import { classifyPriority } from '../services/priorityService.js';
import asyncHandler from '../utils/asyncHandler.js';

const allowedStatuses = ['Pending', 'In Progress', 'Resolved'];

export const createComplaint = asyncHandler(async (req, res) => {
  const { location, description, image } = req.body;

  if (!location || !description) {
    res.status(400);
    throw new Error('Location and description are required.');
  }

  if (image && !/^data:image\//i.test(image) && !/^https?:\/\//i.test(image)) {
    res.status(400);
    throw new Error('Uploaded image format is not supported.');
  }

  // Generate a random 6-digit ticket ID
  const ticketId = Math.floor(100000 + Math.random() * 900000).toString();

  const complaint = await Complaint.create({
    ticketId,
    location,
    description,
    image: image || '',
    priority: classifyPriority(description, location),
    status: 'Pending',
    reportedBy: req.user._id
  });

  res.status(201).json(complaint);
});

export const getComplaints = asyncHandler(async (req, res) => {
  const { priority, status, mine } = req.query;
  const query = {};

  if (priority) {
    query.priority = priority;
  }

  if (status) {
    query.status = status;
  }

  if (mine === 'true' || req.user.role !== 'admin') {
    query.reportedBy = req.user._id;
  }

  const complaints = await Complaint.find(query)
    .populate('reportedBy', 'name email role')
    .sort({ createdAt: -1 });

  res.json(complaints);
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error('A valid status is required.');
  }

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found.');
  }

  complaint.status = status;
  await complaint.save();

  res.json(complaint);
});

export const deleteComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found.');
  }

  await complaint.deleteOne();
  res.json({ message: 'Complaint deleted successfully.' });
});
