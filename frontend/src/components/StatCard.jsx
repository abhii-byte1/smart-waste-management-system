import { motion } from 'framer-motion';
import { staggerItem } from '../utils/motion.js';

const glowStyles = {
  purple: 'glow-exact-purple',
  red: 'glow-exact-red',
  blue: 'glow-exact-blue',
  cyan: 'glow-exact-cyan',
  green: 'glow-exact-green',
};

const iconStyles = {
  purple: 'text-exact-purple border-exact-purple/30 bg-exact-purple/10',
  red: 'text-exact-red border-exact-red/30 bg-exact-red/10',
  blue: 'text-exact-blue border-exact-blue/30 bg-exact-blue/10',
  cyan: 'text-exact-cyan border-exact-cyan/30 bg-exact-cyan/10',
  green: 'text-exact-green border-exact-green/30 bg-exact-green/10',
};

const titleColor = {
  purple: 'text-white',
  red: 'text-white',
  blue: 'text-white',
  cyan: 'text-white',
  green: 'text-white',
};

const StatCard = ({ label, value, subtitle, icon: Icon, glowColor = 'purple', subtitleColor = 'text-exact-green' }) => (
  <motion.div
    variants={staggerItem}
    whileHover={{ scale: 1.02 }}
    className={`relative flex flex-col justify-between overflow-hidden rounded-2xl bg-ink-900/40 p-5 backdrop-blur-sm sm:p-6 ${glowStyles[glowColor]}`}
  >
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-slate-300">{label}</p>
        <p className={`text-4xl font-bold tracking-tight ${titleColor[glowColor]}`}>{value}</p>
        {subtitle && (
          <div className="mt-1 flex items-center gap-1.5 text-[13px]">
            {glowColor === 'red' && <Icon className="h-3.5 w-3.5 text-exact-red" />}
            <p className={subtitleColor}>{subtitle}</p>
          </div>
        )}
      </div>
      {Icon && glowColor !== 'red' && (
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${iconStyles[glowColor]}`}>
          <Icon className="h-5 w-5" />
        </div>
      )}
      {Icon && glowColor === 'red' && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-exact-red/30 bg-exact-red/10 text-exact-red">
          <Icon className="h-5 w-5" />
        </div>
      )}
    </div>

    {/* Optional Sparkline for Purple card (Mocked for exact match) */}
    {glowColor === 'purple' && (
      <div className="absolute bottom-4 right-4 h-8 w-24 opacity-80">
        <svg viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 25C10 25 15 15 25 15C35 15 40 25 50 25C60 25 70 5 80 5C90 5 95 10 100 10" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
          <path d="M0 25C10 25 15 15 25 15C35 15 40 25 50 25C60 25 70 5 80 5C90 5 95 10 100 10L100 30L0 30L0 25Z" fill="url(#purpleGlow)" opacity="0.3" />
          <defs>
            <linearGradient id="purpleGlow" x1="50" y1="5" x2="50" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a855f7" />
              <stop offset="1" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    )}
  </motion.div>
);

export default StatCard;
