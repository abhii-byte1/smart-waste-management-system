import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['contact', 'feedback'],
      required: true
    },
    name: {
      type: String
    },
    email: {
      type: String
    },
    message: {
      type: String
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  { timestamps: true }
);

export default mongoose.model('Feedback', feedbackSchema);
