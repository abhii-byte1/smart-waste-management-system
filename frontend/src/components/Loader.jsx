import { motion } from 'framer-motion';

const Loader = ({ text = 'Loading...' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex min-h-[120px] items-center justify-center"
  >
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 backdrop-blur">
      <div className="flex gap-1">
        <span className="loader-dot h-2 w-2 rounded-full bg-brand-500" />
        <span className="loader-dot h-2 w-2 rounded-full bg-brand-400" />
        <span className="loader-dot h-2 w-2 rounded-full bg-brand-300" />
      </div>
      {text}
    </div>
  </motion.div>
);

export default Loader;
