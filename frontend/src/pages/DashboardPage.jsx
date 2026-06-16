import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ChevronDown, ClipboardList, Flame, Megaphone } from 'lucide-react';
import api from '../api/client.js';
import AdminTable from '../components/AdminTable.jsx';
import Loader from '../components/Loader.jsx';
import StatCard from '../components/StatCard.jsx';
import useComplaints from '../hooks/useComplaints.js';
import { PRIORITY_OPTIONS } from '../utils/constants.js';
import { buttonTap, staggerContainer } from '../utils/motion.js';

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
    <div className="flex flex-col gap-8">
      {/* ═══ Stat Cards ═══ */}
      <motion.div
        className="grid gap-6 md:grid-cols-3"
        variants={staggerContainer(0.1)}
        initial="hidden"
        animate="visible"
      >
        <StatCard 
          label="Total Complaints" 
          value={stats.total} 
          subtitle="(+15% this month)" 
          icon={Megaphone} 
          glowColor="purple" 
          subtitleColor="text-exact-green"
        />
        <StatCard 
          label="High Priority" 
          value={stats.high} 
          subtitle="Urgency" 
          icon={Flame} 
          glowColor="red" 
          subtitleColor="text-slate-400"
        />
        <StatCard 
          label="Open Cases" 
          value={stats.active} 
          subtitle="(Active assignments)" 
          icon={ClipboardList} 
          glowColor="blue" 
          subtitleColor="text-slate-400"
        />
      </motion.div>

      {/* ═══ Table Section ═══ */}
      <div className="flex flex-col rounded-2xl bg-ink-900/30 p-6">
        {/* Table Header Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-white">Active Complaints</h3>
          
          <div className="flex items-center gap-3">
            {/* Mock Filters */}
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-ink-900/50 px-3 py-2 text-sm text-slate-300">
              <span>Date</span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-ink-900/50 px-3 py-2 text-sm text-slate-300">
              <span>Area</span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </div>
            
            {/* Priority Filter (Functional) */}
            <div className="relative">
              <select
                value={selectedPriority}
                onChange={(event) => setSelectedPriority(event.target.value)}
                className="appearance-none rounded-lg border border-white/10 bg-ink-900/50 py-2 pl-3 pr-8 text-sm text-slate-300 outline-none"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option === 'All' ? 'Category' : option}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={buttonTap}
              className="glow-exact-cyan ml-2 rounded-lg bg-exact-cyan px-4 py-2 text-sm font-semibold text-ink-900 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.8)]"
            >
              New Complaint
            </motion.button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <Loader text="Loading dashboard..." />
        ) : (
          <AdminTable complaints={complaints} onStatusChange={handleStatusChange} onDelete={handleDelete} busyId={busyId} />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
