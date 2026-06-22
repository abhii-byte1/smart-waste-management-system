import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { AlertTriangle, ClipboardList, RefreshCcw, TrendingUp, Map as MapIcon, Table as TableIcon, BarChart2, Download } from 'lucide-react';
import api from '../api/client.js';
import AdminTable from '../components/AdminTable.jsx';
import ComplaintDetailsDrawer from '../components/ComplaintDetailsDrawer.jsx';
import Loader from '../components/Loader.jsx';
import PageMeta from '../components/PageMeta.jsx';
import StatCard from '../components/StatCard.jsx';
import useComplaints from '../hooks/useComplaints.js';
import useComplaintStats from '../hooks/useComplaintStats.js';
import { PRIORITY_OPTIONS } from '../utils/constants.js';
import { buttonTap, fadeInUp, staggerContainer } from '../utils/motion.js';

const AdminMap = lazy(() => import('../components/AdminMap.jsx'));
const AnalyticsDashboard = lazy(() => import('../components/AnalyticsDashboard.jsx'));

const DashboardPage = () => {
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [viewMode, setViewMode] = useState('table');
  const [busyId, setBusyId] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const exportMenuRef = useRef(null);

  const needsFullDataset = viewMode === 'map' || viewMode === 'analytics';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
    };
    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportMenu]);

  const {
    complaints: pagedComplaints,
    pagination,
    loading: tableLoading,
    refetch: refetchPaged
  } = useComplaints({
    priority: selectedPriority,
    page: currentPage,
    limit: 50
  });

  const {
    complaints: fullComplaints,
    loading: fullLoading,
    refetch: refetchFull
  } = useComplaints({
    priority: selectedPriority,
    noPaginate: true,
    enabled: needsFullDataset
  });

  const { stats, refetch: refetchStats } = useComplaintStats(selectedPriority);

  const refetch = useCallback(() => {
    refetchPaged();
    refetchStats();
    if (needsFullDataset) refetchFull();
  }, [refetchPaged, refetchStats, refetchFull, needsFullDataset]);

  const fetchExportData = async () => {
    if (fullComplaints.length) return fullComplaints;
    const params = { noPaginate: true };
    if (selectedPriority && selectedPriority !== 'All') params.priority = selectedPriority;
    const { data } = await api.get('/complaints', { params });
    return data.complaints || [];
  };

  const handleExportPDF = async () => {
    try {
      const data = await fetchExportData();
      const { exportToPDF } = await import('../utils/exportUtils.js');
      exportToPDF(data);
      setShowExportMenu(false);
    } catch {
      toast.error('Unable to export PDF.');
    }
  };

  const handleExportCSV = async () => {
    try {
      const data = await fetchExportData();
      const { exportToCSV } = await import('../utils/exportUtils.js');
      exportToCSV(data);
      setShowExportMenu(false);
    } catch {
      toast.error('Unable to export CSV.');
    }
  };

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    try {
      await api.put(`/complaints/${id}`, { status });
      toast.success('Status updated.');
      if (selectedComplaint && selectedComplaint._id === id) {
        setSelectedComplaint((prev) => ({ ...prev, status }));
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

  const sectionLoading = viewMode === 'table' ? tableLoading : fullLoading;

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageMeta
        title="Admin Dashboard"
        description="Admin command center for waste complaint operations."
        path="/admin/dashboard"
        noIndex
      />
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
            <div className="flex bg-ink rounded-xl border border-white/10 overflow-hidden" role="group" aria-label="Dashboard view mode">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                aria-pressed={viewMode === 'table'}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm transition ${viewMode === 'table' ? 'bg-brand-500 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                <TableIcon className="w-4 h-4" /> Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                aria-pressed={viewMode === 'map'}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm transition border-l border-white/5 ${viewMode === 'map' ? 'bg-brand-500 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                <MapIcon className="w-4 h-4" /> Map
              </button>
              <button
                type="button"
                onClick={() => setViewMode('analytics')}
                aria-pressed={viewMode === 'analytics'}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm transition border-l border-white/5 ${viewMode === 'analytics' ? 'bg-brand-500 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                <BarChart2 className="w-4 h-4" /> Analytics
              </button>
            </div>

            <select
              value={selectedPriority}
              onChange={(event) => {
                setSelectedPriority(event.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by priority"
              className="rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-white sm:py-3"
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === 'All' ? 'All Priorities' : `${option} Priority`}
                </option>
              ))}
            </select>

            <div className="relative" ref={exportMenuRef}>
              <motion.button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={buttonTap}
                aria-haspopup="menu"
                aria-expanded={showExportMenu}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition hover:bg-white/10 sm:py-3"
              >
                <Download className="h-4 w-4" />
                Export
              </motion.button>

              {showExportMenu && (
                <div role="menu" className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-slate-800 shadow-xl z-50 overflow-hidden">
                  <button type="button" role="menuitem" onClick={handleExportPDF} className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition">
                    Export as PDF
                  </button>
                  <button type="button" role="menuitem" onClick={handleExportCSV} className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition border-t border-white/5">
                    Export as CSV
                  </button>
                </div>
              )}
            </div>

            <motion.button
              type="button"
              onClick={() => {
                setCurrentPage(1);
                refetch();
              }}
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
          <StatCard label="Total Complaints" value={stats.total} subtitle={stats.monthlyChange} icon={TrendingUp} glowColor="green" />
          <StatCard label="High Priority" value={stats.high} subtitle="Urgency" icon={AlertTriangle} glowColor="red" />
          <StatCard label="Open Cases" value={stats.active} subtitle="Active assignments" icon={ClipboardList} glowColor="cyan" />
        </motion.div>
      </motion.section>

      <section>
        {sectionLoading ? (
          <Loader text="Loading dashboard..." />
        ) : viewMode === 'map' ? (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <Suspense fallback={<Loader text="Loading map..." />}>
              <AdminMap complaints={fullComplaints} />
            </Suspense>
          </motion.div>
        ) : viewMode === 'analytics' ? (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <Suspense fallback={<Loader text="Loading analytics..." />}>
              <AnalyticsDashboard complaints={fullComplaints} />
            </Suspense>
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
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
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
