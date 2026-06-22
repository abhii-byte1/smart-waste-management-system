import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Clock, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import ComplaintForm from '../components/ComplaintForm.jsx';
import ComplaintList from '../components/ComplaintList.jsx';
import CitizenComplaintDrawer from '../components/CitizenComplaintDrawer.jsx';
import Loader from '../components/Loader.jsx';
import StatCard from '../components/StatCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import useComplaints from '../hooks/useComplaints.js';
import { buttonTap, fadeInUp, slideInLeft, slideInRight, staggerContainer } from '../utils/motion.js';
import PageMeta from '../components/PageMeta.jsx';

const HomePage = () => {
  const { user } = useAuth();
  const { complaints, loading, refetch } = useComplaints({ mine: true, enabled: Boolean(user) });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const pendingCount = useMemo(() => complaints.filter((item) => item.status === 'Pending').length, [complaints]);
  const resolvedCount = useMemo(() => complaints.filter((item) => item.status === 'Resolved').length, [complaints]);
  const highPriorityCount = useMemo(() => complaints.filter((item) => item.priority === 'High').length, [complaints]);

  const handleReportClick = (e) => {
    e.preventDefault();
    setIsFormVisible(true);
    setTimeout(() => {
      document.getElementById('report')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  return (
    <div className="space-y-8">
      <PageMeta
        title="Smart Waste Management — Report Civic Issues"
        description="Submit waste issue tickets, track resolution status, and help keep your city clean."
        path="/"
      />
      <section className="grid gap-6 rounded-2xl border border-white/[0.06] bg-surface/50 bg-hero-grid bg-hero-grid bg-top p-5 backdrop-blur sm:rounded-3xl sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div variants={slideInLeft} initial="hidden" animate="visible">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-400 sm:text-sm">Clean cities, faster action</p>
          <h1 className="mt-3 max-w-3xl text-2xl font-bold leading-tight text-white xs:text-3xl sm:mt-4 sm:text-4xl lg:text-5xl">
            Submit waste issue tickets, prioritize them with AI, and track progress.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:mt-5 sm:text-base">
            Citizens can report overflowing bins, dangerous waste, and sanitation issues. Authorities get a focused
            dashboard with filters, status updates, and a structure ready for real deployment.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
            {user ? (
              user.role !== 'admin' && (
                <motion.a
                  href="#report"
                  onClick={handleReportClick}
                  whileHover={{ scale: 1.04 }}
                  whileTap={buttonTap}
                  className="rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
                >
                  Report Issue
                </motion.a>
              )
            ) : (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={buttonTap}>
                <Link to="/register" className="inline-block rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white">
                  Get Started
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="grid gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-1"
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate="visible"
        >
          <StatCard label="My Pending" value={pendingCount} subtitle="awaiting review" icon={Clock} glowColor="amber" />
          <StatCard label="High Priority" value={highPriorityCount} subtitle="critical issues" icon={AlertTriangle} glowColor="red" />
          <StatCard label="Resolved" value={resolvedCount} subtitle="completed" icon={CheckCircle2} glowColor="green" />
        </motion.div>
      </section>

      <section className={`grid gap-6 sm:gap-8 ${isFormVisible ? 'lg:grid-cols-[0.95fr_1.05fr]' : 'lg:grid-cols-1'}`}>
        <AnimatePresence mode="wait">
          {isFormVisible && (
            <motion.div 
              id="report" 
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }} 
              animate={{ opacity: 1, height: 'auto', overflow: 'visible' }} 
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.4 }}
            >
              {user ? (
                user.role === 'admin' ? (
                  <div className="rounded-2xl border border-white/[0.06] bg-surface/50 p-5 backdrop-blur sm:rounded-3xl sm:p-8">
                    <h2 className="text-xl font-semibold text-white sm:text-2xl">Admin Portal</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400 sm:mt-3">
                      Administrators cannot submit new complaints. Please use the Command Center to manage active reports.
                    </p>
                    <div className="mt-5 sm:mt-6">
                      <motion.div whileHover={{ scale: 1.04 }} whileTap={buttonTap} className="inline-block">
                        <Link to="/admin/dashboard" className="inline-block rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white">
                          Open Command Center
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  <ComplaintForm 
                    onCreated={() => { refetch(); setIsFormVisible(false); }} 
                    onCancel={() => setIsFormVisible(false)} 
                  />
                )
              ) : (
                <div className="rounded-2xl border border-white/[0.06] bg-surface/50 p-5 backdrop-blur sm:rounded-3xl sm:p-8">
                  <h2 className="text-xl font-semibold text-white sm:text-2xl">Sign in to submit a complaint</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400 sm:mt-3">
                    Registration is included in this MVP so both citizens and authorities can use the same platform.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3 sm:mt-6">
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={buttonTap}>
                      <Link to="/login" className="inline-block rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white">
                        Login
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={buttonTap}>
                      <Link to="/register" className="inline-block rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white">
                        Create Account
                      </Link>
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="space-y-4 sm:space-y-5" variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">Ticket Tracking</h2>
              <p className="mt-1.5 text-sm text-slate-400 sm:mt-2">View your submitted tickets and monitor live status updates.</p>
            </div>
            {user && user.role !== 'admin' && (
              <motion.button
                type="button"
                onClick={refetch}
                whileHover={{ scale: 1.05 }}
                whileTap={buttonTap}
                transition={{ duration: 0.3 }}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10 sm:px-4"
              >
                <RefreshCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </motion.button>
            )}
          </div>
          {user && (
            user.role === 'admin' ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-surface/50 p-6 text-center text-sm text-slate-400 sm:p-8">
                Complaint tracking is available for citizens only.
              </div>
            ) : (
              loading ? <Loader text="Loading your tickets..." /> : <ComplaintList complaints={complaints} onRowClick={setSelectedComplaint} selectedId={selectedComplaint?._id} />
            )
          )}
        </motion.div>
      </section>

      <CitizenComplaintDrawer 
        complaint={selectedComplaint} 
        onClose={() => setSelectedComplaint(null)} 
      />
    </div>
  );
};

export default HomePage;
