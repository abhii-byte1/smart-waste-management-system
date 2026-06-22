import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../api/client.js';

const useComplaintStats = (priority = 'All', enabled = true) => {
  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    active: 0,
    monthlyChange: '0% vs last month'
  });
  const [loading, setLoading] = useState(enabled);
  const abortRef = useRef(null);

  const fetchStats = useCallback(async () => {
    if (!enabled) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const params = {};
      if (priority && priority !== 'All') params.priority = priority;

      const { data } = await api.get('/complaints/stats', {
        params,
        signal: controller.signal
      });

      if (!controller.signal.aborted) {
        setStats(data);
      }
    } catch (error) {
      if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') return;
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [enabled, priority]);

  useEffect(() => {
    fetchStats();
    return () => abortRef.current?.abort();
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
};

export default useComplaintStats;
