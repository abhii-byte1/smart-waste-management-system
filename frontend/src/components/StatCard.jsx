import { motion } from 'framer-motion';
import { staggerItem } from '../utils/motion.js';

const glowStyles = {
  green: 'glow-card-green',
  red: 'glow-card-red',
  cyan: 'glow-card-cyan',
  amber: 'glow-card-amber'
};

const iconBgStyles = {
  green: 'bg-brand-500/15 text-brand-400',
  red: 'bg-red-500/15 text-red-400',
  cyan: 'bg-cyan-500/15 text-cyan-400',
  amber: 'bg-amber-500/15 text-amber-400'
};

const StatCard = ({ label, value, subtitle, icon: Icon, glowColor = 'green' }) => (
  <motion.div
    variants={staggerItem}
    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    className={`relative overflow-hidden rounded-2xl bg-surface/80 p-4 backdrop-blur sm:p-5 ${glowStyles[glowColor]}`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-slate-400 sm:text-sm">{label}</p>
        <p className="mt-1.5 text-2xl font-bold text-white sm:mt-2 sm:text-3xl lg:text-4xl">{value}</p>
        {subtitle && <p className="mt-1 text-[11px] text-slate-400 sm:mt-1.5 sm:text-xs">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`rounded-xl p-2 sm:p-2.5 ${iconBgStyles[glowColor]}`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      )}
    </div>
  </motion.div>
);

export default StatCard;
