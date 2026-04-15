import { PRIORITY_STYLES, STATUS_OPTIONS, STATUS_STYLES } from '../utils/constants.js';
import { formatDateTime } from '../utils/formatters.js';

const AdminTable = ({ complaints, onStatusChange, onDelete, busyId }) => {
  if (!complaints.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-sm text-slate-300">
        No complaints match the current filter.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
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
            {complaints.map((complaint) => (
              <tr key={complaint._id} className="border-t border-white/10 align-top">
                <td className="px-4 py-4">
                  <div className="font-medium text-white">{complaint.location}</div>
                  <div className="mt-1 text-xs text-slate-400">{complaint.reportedBy?.email || 'Anonymous'}</div>
                </td>
                <td className="px-4 py-4 text-slate-300">{complaint.description}</td>
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
                      className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-white"
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
                  <button
                    type="button"
                    onClick={() => onDelete(complaint._id)}
                    disabled={busyId === complaint._id}
                    className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-200 transition hover:bg-red-500/20 disabled:opacity-60"
                  >
                    {busyId === complaint._id ? 'Working...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
