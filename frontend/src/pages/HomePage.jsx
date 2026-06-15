import { motion } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import ComplaintForm from '../components/ComplaintForm.jsx';
import ComplaintList from '../components/ComplaintList.jsx';
import Loader from '../components/Loader.jsx';
import StatCard from '../components/StatCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import useComplaints from '../hooks/useComplaints.js';
import { buttonTap, fadeInUp, slideInLeft, slideInRight, staggerContainer } from '../utils/motion.js';

const HomePage = () => {
  const { user } = useAuth();
  const { complaints, loading, refetch } = useComplaints({ mine: true, enabled: Boolean(user) });

  const pendingCount = complaints.filter((item) => item.status === 'Pending').length;
  const resolvedCount = complaints.filter((item) => item.status === 'Resolved').length;
  const highPriorityCount = complaints.filter((item) => item.priority === 'High').length;

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="grid gap-6 rounded-[1.5rem] border border-white/10 bg-hero-grid bg-hero-grid bg-top p-5 shadow-glow backdrop-blur sm:rounded-[2rem] sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div variants={slideInLeft} initial="hidden" animate="visible">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-200 sm:text-sm sm:tracking-[0.35em]">Clean cities, faster action</p>
          <h1 className="mt-3 max-w-3xl text-2xl font-semibold leading-tight text-white xs:text-3xl sm:mt-4 sm:text-4xl lg:text-5xl">
            Report waste complaints, prioritize them with AI, and track progress in one platform.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:mt-5 sm:text-base">
            Citizens can report overflowing bins, dangerous waste, and sanitation issues. Authorities get a focused
            dashboard with filters, status updates, and a structure ready for real deployment.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
            {user ? (
              <motion.a
                href="#report"
                whileHover={{ scale: 1.04 }}
                whileTap={buttonTap}
                className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-glow-sm transition hover:bg-brand-600"
              >
                Report Issue
              </motion.a>
            ) : (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={buttonTap}>
                <Link to="/register" className="inline-block rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-glow-sm">
                  Get Started
                </Link>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={buttonTap}>
              <Link
                to={user?.role === 'admin' ? '/dashboard' : '/login'}
                className="inline-block rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                {user?.role === 'admin' ? 'Open Dashboard' : 'Admin Login'}
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="grid gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-1"
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate="visible"
        >
          <StatCard label="My Pending" value={pendingCount} accent="text-slate-100" />
          <StatCard label="High Priority" value={highPriorityCount} accent="text-red-300" />
          <StatCard label="Resolved" value={resolvedCount} accent="text-brand-200" />
        </motion.div>
      </section>

      <section className="grid gap-6 sm:gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div id="report" variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}>
          {user ? (
            <ComplaintForm onCreated={refetch} />
          ) : (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur sm:rounded-[2rem] sm:p-8">
              <h2 className="text-xl font-semibold text-white sm:text-2xl">Sign in to submit a complaint</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300 sm:mt-3">
                Registration is included in this MVP so both citizens and authorities can use the same platform.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 sm:mt-6">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={buttonTap}>
                  <Link to="/login" className="inline-block rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white">
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={buttonTap}>
                  <Link
                    to="/register"
                    className="inline-block rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white"
                  >
                    Create Account
                  </Link>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div className="space-y-4 sm:space-y-5" variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">Complaint Tracking</h2>
              <p className="mt-1.5 text-sm text-slate-300 sm:mt-2">
                View your submitted complaints and monitor live status updates.
              </p>
            </div>
            {user && (
              <motion.button
                type="button"
                onClick={refetch}
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={buttonTap}
                transition={{ duration: 0.3 }}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10 sm:px-4"
              >
                <RefreshCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </motion.button>
            )}
          </div>

          {user && (loading ? <Loader text="Loading your complaints..." /> : <ComplaintList complaints={complaints} />)}
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
