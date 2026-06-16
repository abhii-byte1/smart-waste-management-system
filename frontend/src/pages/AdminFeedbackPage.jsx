import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star } from 'lucide-react';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/motion.js';

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data } = await api.get('/feedback?type=feedback');
        setFeedbacks(data);
      } catch (error) {
        console.error('Failed to fetch feedback:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Platform Feedback</h1>
          <p className="mt-1.5 text-sm text-slate-400">Review app ratings and suggestions from citizens.</p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-white">{averageRating}</span>
          <span className="text-sm text-slate-400">/ 5.0 Average</span>
        </div>
      </motion.div>

      {loading ? (
        <Loader text="Loading feedback..." />
      ) : feedbacks.length === 0 ? (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-surface/50 py-20 text-center backdrop-blur">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            <MessageSquare className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-white">No feedback yet</h3>
          <p className="mt-2 text-sm text-slate-400">Users haven't submitted any feedback.</p>
        </motion.div>
      ) : (
        <motion.div variants={staggerContainer(0.1)} initial="hidden" animate="visible" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {feedbacks.map((item) => (
            <motion.div key={item._id} variants={staggerItem} className="flex flex-col rounded-2xl border border-white/[0.06] bg-surface/50 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-4 flex-1">
                {item.message ? (
                  <p className="text-sm italic text-slate-300">"{item.message}"</p>
                ) : (
                  <p className="text-sm italic text-slate-500">No comment provided.</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AdminFeedbackPage;
