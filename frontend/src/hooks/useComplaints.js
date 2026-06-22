import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client.js';

const useComplaints = ({
  mine = false,
  priority = '',
  sort = '',
  enabled = true,
  page = 1,
  limit = 50,
  noPaginate = false
} = {}) => {
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const abortRef = useRef(null);

  const fetchComplaints = useCallback(async () => {
    if (!enabled) {
      setComplaints([]);
      setPagination(null);
      setLoading(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const params = { page, limit };
      if (mine) params.mine = true;
      if (priority && priority !== 'All') params.priority = priority;
      if (sort) params.sort = sort;
      if (noPaginate) params.noPaginate = true;

      const { data } = await api.get('/complaints', {
        params,
        signal: controller.signal
      });

      if (controller.signal.aborted) return;

      if (Array.isArray(data)) {
        setComplaints(data);
      } else if (data.complaints) {
        setComplaints(data.complaints || []);
        setPagination(data.pagination || null);
      } else {
        setComplaints(data.complaints || []);
        setPagination(data.pagination || null);
      }
    } catch (error) {
      if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') return;
      toast.error(error.response?.data?.message || 'Unable to load complaints.');
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [enabled, mine, priority, sort, page, limit, noPaginate]);

  useEffect(() => {
    fetchComplaints();
    return () => abortRef.current?.abort();
  }, [fetchComplaints]);

  return {
    complaints,
    setComplaints,
    pagination,
    loading,
    refetch: fetchComplaints
  };
};

export default useComplaints;
