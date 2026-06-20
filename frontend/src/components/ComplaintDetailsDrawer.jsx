import { AnimatePresence, motion } from 'framer-motion';
import { X, Calendar, MapPin, Hash, CheckCircle, Trash2, Download, Maximize2 } from 'lucide-react';
import { PRIORITY_STYLES, STATUS_OPTIONS, STATUS_STYLES } from '../utils/constants.js';
import { formatDateTime } from '../utils/formatters.js';
import { exportSingleComplaintPDF } from '../utils/exportUtils.js';
import { useState, useEffect } from 'react';

const ComplaintDetailsDrawer = ({ complaint, onClose, onStatusChange, onDelete, busyId }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else if (complaint) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isLightboxOpen, complaint]);

  if (!complaint) return null;

  return (
    <>
      <AnimatePresence>
        {complaint && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col overflow-y-auto border-l border-white/[0.06] bg-ink/95 shadow-2xl backdrop-blur-xl sm:w-[450px]"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-ink/90 px-6 py-4 backdrop-blur-xl">
                <h2 className="text-lg font-bold text-white">Ticket Details</h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 p-6 space-y-8">
                {/* Header Info */}
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 rounded-lg bg-brand-500/15 px-3 py-1.5 text-xs font-bold tracking-wider text-brand-400">
                      <Hash className="h-3.5 w-3.5" />
                      {complaint.ticketId || 'TKT-OLD'}
                    </span>
                    <span className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${PRIORITY_STYLES[complaint.priority]}`}>
                      {complaint.priority} Priority
                    </span>
                    <span className={`rounded-lg px-3 py-1.5 text-xs font-medium ${STATUS_STYLES[complaint.status]}`}>
                      {complaint.status}
                    </span>
                  </div>
                  
                  <h3 className="mt-4 text-xl font-bold leading-tight text-white">
                    {complaint.location}
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span>Location Confirmed</span>
                  </div>
                </div>

                {/* Image */}
                {complaint.image && (
                  <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/50">
                    <img 
                      src={complaint.image} 
                      alt="Complaint" 
                      className="h-56 w-full object-cover transition duration-300 group-hover:opacity-75"
                    />
                    <button 
                      onClick={() => setIsLightboxOpen(true)}
                      className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    >
                      <div className="flex items-center gap-2 rounded-xl bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                        <Maximize2 className="h-4 w-4" /> Enlarge Image
                      </div>
                    </button>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-300">Full Description</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400 whitespace-pre-wrap">
                    {complaint.description}
                  </p>
                </div>

                {/* Metadata */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-sm">
                      <p className="font-medium text-slate-300">Reported By</p>
                      <p className="mt-1 text-slate-500">{complaint.reportedBy?.email || 'Anonymous Citizen'}</p>
                    </div>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-sm">
                      <p className="font-medium text-slate-300">Submission Date</p>
                      <div className="mt-1 flex items-center gap-2 text-slate-500">
                        <Calendar className="h-4 w-4" />
                        {formatDateTime(complaint.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                  <h4 className="text-sm font-semibold text-slate-300">Quick Actions</h4>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <select
                        value={complaint.status}
                        onChange={(e) => onStatusChange(complaint._id, e.target.value)}
                        disabled={busyId === complaint._id}
                        className="flex-1 rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-white transition focus:border-brand-500"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>

                      {complaint.status !== 'Resolved' && (
                        <button
                          onClick={() => onStatusChange(complaint._id, 'Resolved')}
                          disabled={busyId === complaint._id}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
                        >
                          <CheckCircle className="h-4 w-4" /> Resolve
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => exportSingleComplaintPDF(complaint)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                      >
                        <Download className="h-4 w-4" /> Download PDF
                      </button>

                      <button
                        onClick={() => {
                          onDelete(complaint._id);
                          onClose();
                        }}
                        disabled={busyId === complaint._id}
                        className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && complaint?.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button 
              className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={complaint.image}
              alt="Enlarged"
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ComplaintDetailsDrawer;
