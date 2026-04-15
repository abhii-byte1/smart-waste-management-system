import { RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import ComplaintForm from '../components/ComplaintForm.jsx';
import ComplaintList from '../components/ComplaintList.jsx';
import Loader from '../components/Loader.jsx';
import StatCard from '../components/StatCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import useComplaints from '../hooks/useComplaints.js';

const HomePage = () => {
  const { user } = useAuth();
  const { complaints, loading, refetch } = useComplaints({ mine: true, enabled: Boolean(user) });

  const pendingCount = complaints.filter((item) => item.status === 'Pending').length;
  const resolvedCount = complaints.filter((item) => item.status === 'Resolved').length;
  const highPriorityCount = complaints.filter((item) => item.priority === 'High').length;

  return (
    <div className="space-y-10">
      <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-hero-grid bg-hero-grid bg-top p-8 shadow-glow backdrop-blur lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-brand-200">Clean cities, faster action</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Report waste complaints, prioritize them with AI, and track progress in one platform.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Citizens can report overflowing bins, dangerous waste, and sanitation issues. Authorities get a focused
            dashboard with filters, status updates, and a structure ready for real deployment.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {user ? (
              <a href="#report" className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white">
                Report Issue
              </a>
            ) : (
              <Link to="/register" className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white">
                Get Started
              </Link>
            )}
            <Link
              to={user?.role === 'admin' ? '/dashboard' : '/login'}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white"
            >
              {user?.role === 'admin' ? 'Open Dashboard' : 'Admin Login'}
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <StatCard label="My Pending" value={pendingCount} accent="text-slate-100" />
          <StatCard label="High Priority" value={highPriorityCount} accent="text-red-300" />
          <StatCard label="Resolved" value={resolvedCount} accent="text-brand-200" />
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div id="report">
          {user ? (
            <ComplaintForm onCreated={refetch} />
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
              <h2 className="text-2xl font-semibold text-white">Sign in to submit a complaint</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Registration is included in this MVP so both citizens and authorities can use the same platform.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/login" className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Complaint Tracking</h2>
              <p className="mt-2 text-sm text-slate-300">
                View your submitted complaints and monitor live status updates.
              </p>
            </div>
            {user && (
              <button
                type="button"
                onClick={refetch}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </button>
            )}
          </div>

          {user && (loading ? <Loader text="Loading your complaints..." /> : <ComplaintList complaints={complaints} />)}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
