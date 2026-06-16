import { AnimatePresence, motion } from 'framer-motion';
import { PRIORITY_STYLES, STATUS_OPTIONS, STATUS_STYLES } from '../utils/constants.js';
import { formatDateTime } from '../utils/formatters.js';
import { buttonTap, fadeInUp, staggerContainer, staggerItem } from '../utils/motion.js';

const AdminTable = ({ complaints, onStatusChange, onDelete, busyId }) => {
  if (!complaints.length) {
    return (
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="rounded-2xl border border-dashed border-white/10 bg-surface/50 p-6 text-center text-sm text-slate-400 sm:p-8"
      >
        No complaints match the current filter.
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible">
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-white/[0.06] bg-surface/50 backdrop-blur md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/[0.06] bg-white/[0.02] text-xs uppercase tracking-[0.15em] text-slate-500">
              <tr>
                <th className="px-5 py-4">Ticket ID</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Description</th>
                <th className="px-5 py-4">Priority</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Timestamp</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {complaints.map((complaint, index) => (
                  <motion.tr
                    key={complaint._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="border-t border-white/[0.04] align-top transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4 font-mono text-sm font-bold text-white">
                      #{complaint.ticketId || 'TKT-OLD'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">{complaint.location}</div>
                      <div className="mt-1 text-xs text-slate-500">{complaint.reportedBy?.email || 'Anonymous'}</div>
                    </td>
                    <td className="max-w-[220px] px-5 py-4 text-slate-400">
                      <div className="flex items-start gap-3">
                        {complaint.image && (
                          <img src={complaint.image} alt="Issue" className="h-12 w-12 shrink-0 rounded-lg object-cover border border-white/10" />
                        )}
                        <p className="line-clamp-2 flex-1">{complaint.description}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${PRIORITY_STYLES[complaint.priority]}`}>
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-2">
                        <span className={`w-fit rounded-lg px-3 py-1.5 text-xs font-medium ${STATUS_STYLES[complaint.status]}`}>
                          {complaint.status}
                        </span>
                        <select
                          value={complaint.status}
                          onChange={(event) => onStatusChange(complaint._id, event.target.value)}
                          className="rounded-lg border border-white/10 bg-ink px-3 py-2 text-xs text-white transition focus:border-brand-500"
                          disabled={busyId === complaint._id}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">{formatDateTime(complaint.createdAt)}</td>
                    <td className="px-5 py-4">
                      <motion.button
                        type="button"
                        onClick={() => onDelete(complaint._id)}
                        disabled={busyId === complaint._id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={buttonTap}
                        className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                      >
                        {busyId === complaint._id ? 'Working...' : 'Delete'}
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card view */}
      <motion.div
        className="grid gap-3 md:hidden"
        variants={staggerContainer(0.06)}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {complaints.map((complaint) => (
            <motion.div
              key={complaint._id}
              variants={staggerItem}
              layout
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="rounded-2xl border border-white/[0.06] bg-surface/50 p-4 backdrop-blur"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white tracking-wider">
                  #{complaint.ticketId || 'TKT-OLD'}
                </span>
                <span className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold ${PRIORITY_STYLES[complaint.priority]}`}>
                  {complaint.priority}
                </span>
                <span className={`rounded-lg px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLES[complaint.status]}`}>
                  {complaint.status}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-medium text-white">{complaint.location}</h3>
              <p className="mt-1 text-xs text-slate-500">{complaint.reportedBy?.email || 'Anonymous'}</p>
              {complaint.image && (
                <img src={complaint.image} alt="Issue" className="mt-3 h-32 w-full rounded-xl object-cover border border-white/10" />
              )}
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400">{complaint.description}</p>
              <p className="mt-3 text-xs text-slate-500">{formatDateTime(complaint.createdAt)}</p>
              <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-3">
                <select
                  value={complaint.status}
                  onChange={(event) => onStatusChange(complaint._id, event.target.value)}
                  className="flex-1 rounded-lg border border-white/10 bg-ink px-3 py-2 text-xs text-white"
                  disabled={busyId === complaint._id}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <motion.button
                  type="button"
                  onClick={() => onDelete(complaint._id)}
                  disabled={busyId === complaint._id}
                  whileTap={buttonTap}
                  className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 disabled:opacity-50"
                >
                  {busyId === complaint._id ? '...' : 'Delete'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default AdminTable;
