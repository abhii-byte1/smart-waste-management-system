import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { RefreshCcw } from 'lucide-react';
import api from '../api/client.js';
import AdminTable from '../components/AdminTable.jsx';
import Loader from '../components/Loader.jsx';
import StatCard from '../components/StatCard.jsx';
import useComplaints from '../hooks/useComplaints.js';
import { PRIORITY_OPTIONS } from '../utils/constants.js';
import { buttonTap, fadeInUp, staggerContainer } from '../utils/motion.js';

const DashboardPage = () => {
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [busyId, setBusyId] = useState('');
  const { complaints, loading, refetch } = useComplaints({ priority: selectedPriority });

  const stats = useMemo(
    () => ({
      total: complaints.length,
      high: complaints.filter((item) => item.priority === 'High').length,
      active: complaints.filter((item) => item.status !== 'Resolved').length
    }),
    [complaints]
  );

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    try {
      await api.put(`/complaints/${id}`, { status });
      toast.success('Status updated.');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update status.');
    } finally {
      setBusyId('');
    }
  };

  const handleDelete = async (id) => {
    setBusyId(id);
    try {
      await api.delete(`/complaints/${id}`);
      toast.success('Complaint deleted.');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete complaint.');
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur sm:rounded-[2rem] sm:p-8"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-200 sm:text-sm sm:tracking-[0.35em]">Admin Command Center</p>
            <h1 className="mt-2 text-2xl font-semibold text-white sm:mt-3 sm:text-3xl lg:text-4xl">Waste complaint operations dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:mt-3">
              Review incoming complaints, filter by priority, update progress, and remove stale reports when needed.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedPriority}
              onChange={(event) => setSelectedPriority(event.target.value)}
              className="rounded-full border border-white/10 bg-slate-950/80 px-4 py-2.5 text-sm text-white sm:py-3"
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === 'All' ? 'All Priorities' : `${option} Priority`}
                </option>
              ))}
            </select>

            <motion.button
              type="button"
              onClick={refetch}
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={buttonTap}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition hover:bg-white/10 sm:py-3"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </motion.button>
          </div>
        </div>

        <motion.div
          className="mt-6 grid gap-3 sm:gap-4 md:grid-cols-3 sm:mt-8"
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="visible"
        >
          <StatCard label="Total Complaints" value={stats.total} accent="text-slate-100" />
          <StatCard label="High Priority" value={stats.high} accent="text-red-300" />
          <StatCard label="Open Cases" value={stats.active} accent="text-amber-300" />
        </motion.div>
      </motion.section>

      <section>{loading ? <Loader text="Loading dashboard..." /> : <AdminTable complaints={complaints} onStatusChange={handleStatusChange} onDelete={handleDelete} busyId={busyId} />}</section>
    </div>
  );
};

export default DashboardPage;
