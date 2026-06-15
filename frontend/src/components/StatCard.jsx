import { motion } from 'framer-motion';
import { cardHover, staggerItem } from '../utils/motion.js';

const StatCard = ({ label, value, accent }) => (
  <motion.div
    variants={staggerItem}
    initial="rest"
    whileHover="hover"
    className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-glow backdrop-blur transition-shadow hover:shadow-glow-lg sm:p-5"
  >
    <motion.div variants={cardHover}>
      <p className="text-xs text-slate-400 sm:text-sm">{label}</p>
      <p className={`mt-2 text-2xl font-semibold sm:mt-3 sm:text-3xl ${accent}`}>{value}</p>
    </motion.div>
  </motion.div>
);

export default StatCard;
