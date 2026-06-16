import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, CheckCircle2, ChevronDown, Clock, Hourglass, Settings } from 'lucide-react';
import { STATUS_OPTIONS } from '../utils/constants.js';
import { formatDateTime } from '../utils/formatters.js';
import { buttonTap, fadeInUp, staggerContainer, staggerItem } from '../utils/motion.js';

const getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case 'High': return 'badge-hollow-red';
    case 'Medium': return 'badge-hollow-blue';
    case 'Low': return 'badge-hollow-green';
    default: return 'badge-hollow-blue';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Pending': return <Hourglass className="h-3.5 w-3.5" />;
    case 'In Progress': return <Clock className="h-3.5 w-3.5" />;
    case 'Resolved': return <CheckCircle2 className="h-3.5 w-3.5" />;
    default: return <Calendar className="h-3.5 w-3.5" />;
  }
};

const formatCustomDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  const time = date.toLocaleString('default', { hour: '2-digit', minute: '2-digit' });
  return (
    <>
      <span className="block">{month} {day},</span>
      <span className="block">{time}</span>
    </>
  );
};

const AdminTable = ({ complaints, onStatusChange, onDelete, busyId }) => {
  if (!complaints.length) {
    return (
      <div className="py-8 text-center text-sm text-slate-500">
        No active complaints.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-white/[0.06] text-xs font-medium text-slate-500">
            <tr>
              <th className="pb-4 font-normal">Complaint ID</th>
              <th className="pb-4 font-normal">Date & Time</th>
              <th className="pb-4 font-normal">Description</th>
              <th className="pb-4 font-normal">Location</th>
              <th className="pb-4 font-normal">Category</th>
              <th className="pb-4 font-normal">Priority</th>
              <th className="pb-4 font-normal">Assignee</th>
              <th className="pb-4 font-normal">Status</th>
              <th className="pb-4 text-right font-normal">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            <AnimatePresence>
              {complaints.map((complaint, index) => (
                <motion.tr
                  key={complaint._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 10, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
                >
                  <td className="py-4 text-slate-400">#{complaint._id.slice(-5)}</td>
                  <td className="py-4 text-slate-300">{formatCustomDate(complaint.createdAt)}</td>
                  <td className="py-4 text-white max-w-[150px] truncate pr-4">{complaint.description}</td>
                  <td className="py-4 text-slate-300 max-w-[120px] truncate pr-4">{complaint.location}</td>
                  <td className="py-4 text-slate-300">General</td>
                  
                  {/* Priority Badge */}
                  <td className="py-4">
                    <span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold tracking-wider uppercase ${getPriorityBadgeClass(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                  </td>

                  <td className="py-4 text-slate-300">
                    {complaint.reportedBy?.name?.split(' ')[0] || 'System'}
                  </td>

                  {/* Status Chip Select */}
                  <td className="py-4">
                    <div className="relative inline-block">
                      <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-ink-900/50 px-2 py-1.5 text-xs text-slate-300 transition-colors hover:bg-white/5">
                        {getStatusIcon(complaint.status)}
                        <select
                          value={complaint.status}
                          onChange={(event) => onStatusChange(complaint._id, event.target.value)}
                          className="appearance-none bg-transparent outline-none cursor-pointer pr-4"
                          disabled={busyId === complaint._id}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status} className="bg-ink-800">{status}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 text-right">
                    <motion.button
                      type="button"
                      onClick={() => onDelete(complaint._id)}
                      disabled={busyId === complaint._id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={buttonTap}
                      className="text-slate-500 hover:text-white disabled:opacity-50"
                    >
                      [ <Settings className="inline-block h-4 w-4" /> ]
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
