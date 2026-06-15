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
        className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-6 text-center text-sm text-slate-300 sm:p-8"
      >
        No complaints match the current filter.
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible">
      {/* Desktop table view */}
      <div className="hidden overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-200">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="px-4 py-4">Location</th>
                <th className="px-4 py-4">Description</th>
                <th className="px-4 py-4">Priority</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Timestamp</th>
                <th className="px-4 py-4">Actions</th>
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
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className="border-t border-white/10 align-top transition-colors hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium text-white">{complaint.location}</div>
                      <div className="mt-1 text-xs text-slate-400">{complaint.reportedBy?.email || 'Anonymous'}</div>
                    </td>
                    <td className="max-w-[220px] px-4 py-4 text-slate-300">
                      <p className="line-clamp-2">{complaint.description}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${PRIORITY_STYLES[complaint.priority]}`}>
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        <span className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[complaint.status]}`}>
                          {complaint.status}
                        </span>
                        <select
                          value={complaint.status}
                          onChange={(event) => onStatusChange(complaint._id, event.target.value)}
                          className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white transition focus:border-brand-500"
                          disabled={busyId === complaint._id}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-400">{formatDateTime(complaint.createdAt)}</td>
                    <td className="px-4 py-4">
                      <motion.button
                        type="button"
                        onClick={() => onDelete(complaint._id)}
                        disabled={busyId === complaint._id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={buttonTap}
                        className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-200 transition hover:bg-red-500/20 disabled:opacity-60"
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
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
            >
              {/* Header: priority + status */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${PRIORITY_STYLES[complaint.priority]}`}>
                  {complaint.priority}
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLES[complaint.status]}`}>
                  {complaint.status}
                </span>
              </div>

              {/* Location */}
              <h3 className="mt-3 text-sm font-medium text-white">{complaint.location}</h3>
              <p className="mt-1 text-xs text-slate-400">{complaint.reportedBy?.email || 'Anonymous'}</p>

              {/* Description */}
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-300">{complaint.description}</p>

              {/* Timestamp */}
              <p className="mt-3 text-xs text-slate-400">{formatDateTime(complaint.createdAt)}</p>

              {/* Actions */}
              <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
                <select
                  value={complaint.status}
                  onChange={(event) => onStatusChange(complaint._id, event.target.value)}
                  className="flex-1 rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white"
                  disabled={busyId === complaint._id}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <motion.button
                  type="button"
                  onClick={() => onDelete(complaint._id)}
                  disabled={busyId === complaint._id}
                  whileTap={buttonTap}
                  className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-200 transition hover:bg-red-500/20 disabled:opacity-60"
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
