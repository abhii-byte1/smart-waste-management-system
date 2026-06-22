import { useState } from 'react';
import api from '../api/client.js';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';
import { buttonTap, fadeInUp } from '../utils/motion.js';
import { useAuth } from '../context/AuthContext.jsx';
import PageMeta from '../components/PageMeta.jsx';

const FeedbackPage = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/feedback', {
        type: 'feedback',
        rating,
        message: comment,
        // Auto-populate from logged-in user so admin can identify who submitted feedback
        name: user?.name || '',
        email: user?.email || ''
      });
      toast.success('Thank you for your feedback!');
      setRating(0);
      setHover(0);
      setComment('');
    } catch (error) {
      toast.error('Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'mt-2 w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-white outline-none transition-all duration-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30';

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      <PageMeta title="Feedback" description="Share feedback to help improve the Smart Waste Management platform." path="/feedback" noIndex />
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-400">Your Opinion Matters</p>
        <h1 className="mt-4 text-3xl font-bold text-white sm:text-5xl">App Feedback</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400 sm:text-base">
          Help us improve the Smart Waste Management platform by sharing your experience.
        </p>
        {user && (
          <p className="mt-3 text-xs text-slate-400">
            Submitting as <span className="text-brand-400">{user.email}</span>
          </p>
        )}
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="rounded-3xl border border-white/[0.06] bg-surface/50 p-6 backdrop-blur sm:p-10"
      >
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-medium text-white">How would you rate your experience?</h2>
          <div className="mt-6 flex gap-2" role="radiogroup" aria-label="Rate your experience out of 5 stars">
            {[1, 2, 3, 4, 5].map((index) => {
              const isFilled = index <= (hover || rating);
              return (
                <button
                  type="button"
                  role="radio"
                  aria-checked={rating === index}
                  key={index}
                  onClick={() => setRating(index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(rating)}
                  aria-label={`Rate ${index} out of 5 stars`}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 sm:h-12 sm:w-12 ${
                      isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <label htmlFor="feedback-comment" className="block text-sm text-slate-300">
            What could we improve? (Optional)
          </label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="5"
            className={inputClass}
            placeholder="Tell us what you liked or what needs work..."
          />
        </div>

        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: 1.02 }}
          whileTap={buttonTap}
          className="mt-8 w-full rounded-xl bg-brand-500 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default FeedbackPage;

