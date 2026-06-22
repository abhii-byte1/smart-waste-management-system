import { AnimatePresence, motion } from 'framer-motion';
import { X, Calendar, MapPin, Hash, User2, Maximize2, CheckCircle2, CircleDashed, CheckCircle } from 'lucide-react';
import { PRIORITY_STYLES, STATUS_STYLES } from '../utils/constants.js';
import { formatDateTime } from '../utils/formatters.js';
import { complaintImageAlt, lazyImageProps } from '../utils/imageUtils.js';
import useFocusTrap from '../hooks/useFocusTrap.js';
import { useState, useRef } from 'react';

const TimelineStep = ({ label, isCompleted, isCurrent, isLast }) => (
  <div className="relative flex gap-4">
    {!isLast && (
      <div className={`absolute left-3 top-8 -bottom-2 w-px ${isCompleted ? 'bg-brand-500' : 'bg-white/[0.06]'}`} />
    )}
    <div className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink ring-4 ring-ink">
      {isCompleted ? (
        <CheckCircle className="h-5 w-5 text-brand-500" />
      ) : isCurrent ? (
        <CircleDashed className="h-5 w-5 animate-spin-slow text-brand-400" />
      ) : (
        <div className="h-2.5 w-2.5 rounded-full bg-white/[0.06]" />
      )}
    </div>
    <div className={`pb-8 pt-1 ${isCompleted || isCurrent ? 'text-white' : 'text-slate-400'}`}>
      <p className="font-medium">{label}</p>
    </div>
  </div>
);

const CitizenComplaintDrawer = ({ complaint, onClose }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const drawerRef = useRef(null);
  const titleId = 'citizen-complaint-title';

  useFocusTrap(Boolean(complaint) && !isLightboxOpen, drawerRef, () => {
    if (isLightboxOpen) {
      setIsLightboxOpen(false);
    } else {
      onClose();
    }
  });

  if (!complaint) return null;

  const isPending = complaint.status === 'Pending';
  const isInProgress = complaint.status === 'In Progress';
  const isResolved = complaint.status === 'Resolved';

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
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col overflow-y-auto border-l border-white/[0.06] bg-ink/95 shadow-2xl backdrop-blur-xl sm:w-[450px]"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-ink/90 px-6 py-4 backdrop-blur-xl">
                <h2 id={titleId} className="text-lg font-bold text-white">Ticket Tracking</h2>
                <button
                  onClick={onClose}
                  aria-label="Close drawer"
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
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>Location Details</span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-sm">
                      <p className="font-medium text-slate-300">Reported By</p>
                      <div className="mt-1 flex items-center gap-2 text-slate-400">
                        <User2 className="h-4 w-4" />
                        {complaint.reportedBy?.name || 'Citizen'}
                      </div>
                    </div>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-sm">
                      <p className="font-medium text-slate-300">Submission Date</p>
                      <div className="mt-1 flex items-center gap-2 text-slate-400">
                        <Calendar className="h-4 w-4" />
                        {formatDateTime(complaint.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-6">Status History</h4>
                  <div className="pl-2">
                    <TimelineStep 
                      label="Ticket Submitted" 
                      isCompleted={true} 
                      isCurrent={false} 
                    />
                    <TimelineStep 
                      label="Under Review" 
                      isCompleted={isInProgress || isResolved} 
                      isCurrent={isPending} 
                    />
                    <TimelineStep 
                      label="In Progress" 
                      isCompleted={isResolved} 
                      isCurrent={isInProgress} 
                    />
                    <TimelineStep 
                      label="Resolved" 
                      isCompleted={isResolved} 
                      isCurrent={false} 
                      isLast={true} 
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-300">Description</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400 whitespace-pre-wrap">
                    {complaint.description}
                  </p>
                </div>

                {/* Image */}
                {complaint.image && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-3">Evidence Attached</h4>
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/50">
                      <img 
                        src={complaint.image} 
                        alt={complaintImageAlt(complaint)}
                        width={640}
                        height={224}
                        {...lazyImageProps}
                        className="h-56 w-full object-cover transition duration-300 group-hover:opacity-75"
                      />
                      <button 
                        onClick={() => setIsLightboxOpen(true)}
                        aria-label="View evidence fullscreen"
                        className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      >
                        <div className="flex items-center gap-2 rounded-xl bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                          <Maximize2 className="h-4 w-4" /> Enlarge Image
                        </div>
                      </button>
                    </div>
                  </div>
                )}
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
              aria-label="Close enlarged image"
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

export default CitizenComplaintDrawer;
