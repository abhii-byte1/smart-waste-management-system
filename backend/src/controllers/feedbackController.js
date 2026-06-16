import Feedback from '../models/Feedback.js';

export const submitFeedback = async (req, res) => {
  try {
    const { type, name, email, message, rating } = req.body;

    const feedback = await Feedback.create({
      type,
      name,
      email,
      message,
      rating
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
