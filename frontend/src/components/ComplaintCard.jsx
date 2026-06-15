import { motion } from 'framer-motion';
import { Clock3, MapPin, User2 } from 'lucide-react';
import { PRIORITY_STYLES, STATUS_STYLES } from '../utils/constants.js';
import { formatDateTime } from '../utils/formatters.js';
import { staggerItem } from '../utils/motion.js';

const ComplaintCard = ({ complaint }) => (
  <motion.article
    variants={staggerItem}
    layout
    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
    className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur transition-shadow hover:shadow-glow-sm sm:p-5"
  >
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium sm:px-3 sm:text-xs ${PRIORITY_STYLES[complaint.priority]}`}>
        {complaint.priority} Priority
      </span>
      <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium sm:px-3 sm:text-xs ${STATUS_STYLES[complaint.status]}`}>
        {complaint.status}
      </span>
    </div>

    <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
      <p className="flex items-start gap-2 text-sm text-slate-200">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
        <span className="break-words">{complaint.location}</span>
      </p>
      <p className="text-sm leading-6 text-slate-300">{complaint.description}</p>
      {complaint.image && (
        <motion.img
          src={complaint.image}
          alt="Complaint evidence"
          className="h-36 w-full rounded-2xl object-cover ring-1 ring-white/10 sm:h-48"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </div>

    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400 sm:mt-5 sm:gap-4">
      <span className="flex items-center gap-1">
        <Clock3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        {formatDateTime(complaint.createdAt)}
      </span>
      {complaint.reportedBy?.name && (
        <span className="flex items-center gap-1">
          <User2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          {complaint.reportedBy.name}
        </span>
      )}
    </div>
  </motion.article>
);

export default ComplaintCard;
