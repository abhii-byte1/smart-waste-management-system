import { Clock3, MapPin, User2 } from 'lucide-react';
import { PRIORITY_STYLES, STATUS_STYLES } from '../utils/constants.js';
import { formatDateTime } from '../utils/formatters.js';

const ComplaintCard = ({ complaint }) => (
  <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
    <div className="flex flex-wrap items-center gap-3">
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${PRIORITY_STYLES[complaint.priority]}`}>
        {complaint.priority} Priority
      </span>
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[complaint.status]}`}>
        {complaint.status}
      </span>
    </div>

    <div className="mt-4 space-y-3">
      <p className="flex items-start gap-2 text-sm text-slate-200">
        <MapPin className="mt-0.5 h-4 w-4 text-brand-500" />
        <span>{complaint.location}</span>
      </p>
      <p className="text-sm leading-6 text-slate-300">{complaint.description}</p>
      {complaint.image && (
        <img
          src={complaint.image}
          alt="Complaint evidence"
          className="h-48 w-full rounded-2xl object-cover ring-1 ring-white/10"
        />
      )}
    </div>

    <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-400">
      <span className="flex items-center gap-1">
        <Clock3 className="h-4 w-4" />
        {formatDateTime(complaint.createdAt)}
      </span>
      {complaint.reportedBy?.name && (
        <span className="flex items-center gap-1">
          <User2 className="h-4 w-4" />
          {complaint.reportedBy.name}
        </span>
      )}
    </div>
  </article>
);

export default ComplaintCard;
