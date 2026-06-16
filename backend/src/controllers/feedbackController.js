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

export const getFeedbacks = async (req, res) => {
  try {
    const type = req.query.type;
    const filter = type ? { type } : {};
    const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
