import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { AlertTriangle, ClipboardList, RefreshCcw, TrendingUp, Map as MapIcon, Table as TableIcon, BarChart2, Download, ArrowUpDown } from 'lucide-react';
import api from '../api/client.js';
import AdminTable from '../components/AdminTable.jsx';
import AdminMap from '../components/AdminMap.jsx';
import AnalyticsDashboard from '../components/AnalyticsDashboard.jsx';
import ComplaintDetailsDrawer from '../components/ComplaintDetailsDrawer.jsx';
import Loader from '../components/Loader.jsx';
import StatCard from '../components/StatCard.jsx';
import useComplaints from '../hooks/useComplaints.js';
import { PRIORITY_OPTIONS } from '../utils/constants.js';
import { exportToCSV, exportToPDF } from '../utils/exportUtils.js';
import { buttonTap, fadeInUp, staggerContainer } from '../utils/motion.js';

const SORT_OPTIONS = [
  { value: 'time_desc', label: 'Newest First' },
  { value: 'time_asc', label: 'Oldest First' },
  { value: 'priority_desc', label: 'Priority: High to Low' },
  { value: 'priority_asc', label: 'Priority: Low to High' }
];

const DashboardPage = () => {
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedSort, setSelectedSort] = useState('time_desc');
  const [viewMode, setViewMode] = useState('table'); // 'table', 'map', or 'analytics'
  const [busyId, setBusyId] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  // Paginated data for the Table
  const { complaints: pagedComplaints, pagination, loading, refetch } = useComplaints({ 
    priority: selectedPriority, 
    sort: selectedSort,
    page: currentPage, 
    limit: 50 
  });

  // Unpaginated data for Analytics, Maps, and Exports
  const { complaints: allComplaints } = useComplaints({ 
    priority: selectedPriority, 
    sort: selectedSort,
    noPaginate: true 
  });

  const stats = useMemo(
    () => ({
      total: allComplaints.length,
      high: allComplaints.filter((item) => item.priority === 'High').length,
      active: allComplaints.filter((item) => item.status !== 'Resolved').length
    }),
    [allComplaints]
  );

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    try {
      await api.put(`/complaints/${id}`, { status });
      toast.success('Status updated.');
      
      // Update local state for drawer if it's currently open
      if (selectedComplaint && selectedComplaint._id === id) {
        setSelectedComplaint(prev => ({ ...prev, status }));
      }
      
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
      if (selectedComplaint && selectedComplaint._id === id) {
        setSelectedComplaint(null);
      }
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
        className="rounded-2xl border border-white/[0.06] bg-surface/50 p-5 backdrop-blur sm:rounded-3xl sm:p-8"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-400 sm:text-sm">Admin Command Center</p>
            <h1 className="mt-2 text-2xl font-bold text-white sm:mt-3 sm:text-3xl lg:text-4xl">Waste complaint operations dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:mt-3">
              Review incoming complaints, filter by priority, update progress, and remove stale reports when needed.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-ink rounded-xl border border-white/10 overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm transition ${viewMode === 'table' ? 'bg-brand-500 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                <TableIcon className="w-4 h-4" /> Table
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm transition border-l border-white/5 ${viewMode === 'map' ? 'bg-brand-500 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                <MapIcon className="w-4 h-4" /> Map
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm transition border-l border-white/5 ${viewMode === 'analytics' ? 'bg-brand-500 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                <BarChart2 className="w-4 h-4" /> Analytics
              </button>
            </div>

            <div className="flex gap-3">
              <select
                value={selectedPriority}
                onChange={(event) => setSelectedPriority(event.target.value)}
                className="rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-white sm:py-3"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option === 'All' ? 'All Priorities' : `${option} Priority`}
                  </option>
                ))}
              </select>

              <select
                value={selectedSort}
                onChange={(event) => setSelectedSort(event.target.value)}
                className="rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-white sm:py-3"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <motion.button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={buttonTap}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition hover:bg-white/10 sm:py-3"
              >
                <Download className="h-4 w-4" />
                Export
              </motion.button>
              
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-slate-800 shadow-xl z-50 overflow-hidden">
                  <button onClick={() => { exportToPDF(allComplaints); setShowExportMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition">
                    📄 Export as PDF
                  </button>
                  <button onClick={() => { exportToCSV(allComplaints); setShowExportMenu(false); }} className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition border-t border-white/5">
                    📊 Export as CSV
                  </button>
                </div>
              )}
            </div>

            <motion.button
              type="button"
              onClick={() => { setCurrentPage(1); refetch(); }}
              whileHover={{ scale: 1.05 }}
              whileTap={buttonTap}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition hover:bg-white/10 sm:py-3"
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
          <StatCard label="Total Complaints" value={stats.total} subtitle="+15% this month" icon={TrendingUp} glowColor="green" />
          <StatCard label="High Priority" value={stats.high} subtitle="Urgency" icon={AlertTriangle} glowColor="red" />
          <StatCard label="Open Cases" value={stats.active} subtitle="Active assignments" icon={ClipboardList} glowColor="cyan" />
        </motion.div>
      </motion.section>

      <section>
        {loading ? (
          <Loader text="Loading dashboard..." />
        ) : viewMode === 'map' ? (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <AdminMap complaints={allComplaints} />
          </motion.div>
        ) : viewMode === 'analytics' ? (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <AnalyticsDashboard complaints={allComplaints} />
          </motion.div>
        ) : (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <AdminTable 
              complaints={pagedComplaints} 
              onStatusChange={handleStatusChange} 
              onDelete={handleDelete} 
              busyId={busyId} 
              onRowClick={setSelectedComplaint}
              selectedId={selectedComplaint?._id}
            />
            
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-6">
                <p className="text-sm text-slate-400">
                  Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total tickets)
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={currentPage === pagination.totalPages}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </section>
      
      <ComplaintDetailsDrawer 
        complaint={selectedComplaint} 
        onClose={() => setSelectedComplaint(null)} 
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        busyId={busyId}
      />
    </div>
  );
};

export default DashboardPage;
