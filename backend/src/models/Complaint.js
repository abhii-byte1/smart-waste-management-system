import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: [true, 'Location is required.'],
      trim: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
      trim: true
    },
    image: {
      type: String,
      default: ''
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Low'
    },
    priorityWeight: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending'
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to ensure priorityWeight matches priority
complaintSchema.pre('save', function (next) {
  if (this.isModified('priority') || this.isNew) {
    if (this.priority === 'High') this.priorityWeight = 3;
    else if (this.priority === 'Medium') this.priorityWeight = 2;
    else this.priorityWeight = 1;
  }
  next();
});

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
