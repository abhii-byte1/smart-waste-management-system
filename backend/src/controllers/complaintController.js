import Complaint from '../models/Complaint.js';
import { classifyPriority } from '../services/priorityService.js';
import { uploadImage } from '../utils/cloudinary.js';
import asyncHandler from '../utils/asyncHandler.js';

const allowedStatuses = ['Pending', 'In Progress', 'Resolved'];

export const createComplaint = asyncHandler(async (req, res) => {
  const { location, coordinates, description, image } = req.body;

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

  // Upload to Cloudinary if image is present
  let secureImageUrl = '';
  if (image) {
    secureImageUrl = await uploadImage(image);
  }

  const complaint = await Complaint.create({
    ticketId,
    location,
    coordinates,
    description,
    image: secureImageUrl,
    priority: classifyPriority(description, location),
    status: 'Pending',
    reportedBy: req.user._id
  });

  res.status(201).json(complaint);
});

export const getComplaints = asyncHandler(async (req, res) => {
  const { priority, status, mine, page, limit, noPaginate } = req.query;
  const query = {};

  if (priority && priority !== 'All') {
    query.priority = priority;
  }

  if (status && status !== 'All') {
    query.status = status;
  }

  if (mine === 'true' || req.user.role !== 'admin') {
    query.reportedBy = req.user._id;
  }

  // Support bypassing pagination for Analytics & Exports (Admin only)
  if (noPaginate === 'true' && req.user.role === 'admin') {
    const allComplaints = await Complaint.find(query)
      .populate('reportedBy', 'name email role')
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ complaints: allComplaints });
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 50;
  const startIndex = (pageNum - 1) * limitNum;

  const total = await Complaint.countDocuments(query);
  const complaints = await Complaint.find(query)
    .populate('reportedBy', 'name email role')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limitNum)
    .lean();

  res.json({
    complaints,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  });
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
