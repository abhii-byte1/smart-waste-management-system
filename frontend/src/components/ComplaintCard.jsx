import { motion } from 'framer-motion';
import { Clock3, MapPin, User2 } from 'lucide-react';
import { PRIORITY_STYLES, STATUS_STYLES } from '../utils/constants.js';
import { formatDateTime } from '../utils/formatters.js';
import { staggerItem } from '../utils/motion.js';

const ComplaintCard = ({ complaint, onClick, isSelected }) => (
  <motion.article
    onClick={() => onClick?.(complaint)}
    variants={staggerItem}
    layout
    whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
    className={`glow-card-green cursor-pointer rounded-2xl border border-white/[0.06] p-4 backdrop-blur transition-colors sm:p-5 ${
      isSelected ? 'bg-white/[0.06]' : 'bg-surface/60 hover:bg-surface/80'
    }`}
  >
    {/* Header: [Ticket #...] [Priority] [Status] */}
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <span className="rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-bold tracking-wider text-white sm:px-3 sm:text-xs">
        #{complaint.ticketId || 'TKT-OLD'}
      </span>
      <span className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:text-xs ${PRIORITY_STYLES[complaint.priority]}`}>
        {complaint.priority} Priority
      </span>
      <span className={`rounded-lg px-2.5 py-1 text-[11px] font-medium sm:px-3 sm:text-xs ${STATUS_STYLES[complaint.status]}`}>
        {complaint.status}
      </span>
    </div>

    {/* Metadata: User, Location, Date */}
    <div className="mt-4 flex flex-col gap-2 text-xs text-slate-400 sm:mt-5">
      <div className="flex items-center gap-2">
        <User2 className="h-4 w-4 shrink-0 text-slate-500" />
        <span className="font-medium text-slate-300">User:</span>
        <span>{complaint.reportedBy?.name || 'Citizen'}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
        <span className="font-medium text-slate-300">Location:</span>
        <span className="line-clamp-1">{complaint.location}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock3 className="h-4 w-4 shrink-0 text-slate-500" />
        <span className="font-medium text-slate-300">Date:</span>
        <span>{formatDateTime(complaint.createdAt)}</span>
      </div>
    </div>

    {/* Complaint Description Preview */}
    <div className="mt-4">
      <p className="line-clamp-2 text-sm leading-6 text-slate-400">
        {complaint.description}
      </p>
    </div>

    {/* Complaint Image Thumbnail */}
    {complaint.image && (
      <div className="mt-4">
        <motion.img
          src={complaint.image}
          alt="Complaint evidence"
          className="h-36 w-full rounded-xl object-cover ring-1 ring-white/10 sm:h-48"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
      </div>
    )}
  </motion.article>
);

export default ComplaintCard;
