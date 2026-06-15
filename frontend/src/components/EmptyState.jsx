import { motion } from 'framer-motion';
import { fadeInUp } from '../utils/motion.js';

const EmptyState = ({ title, description }) => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    animate="visible"
    className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-6 text-center sm:p-8"
  >
    <h3 className="text-base font-semibold text-white sm:text-lg">{title}</h3>
    <p className="mt-2 text-sm text-slate-300">{description}</p>
  </motion.div>
);

export default EmptyState;
