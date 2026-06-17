import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client.js';

const useComplaints = ({ mine = false, priority = '', enabled = true, page = 1, limit = 50, noPaginate = false } = {}) => {
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(enabled);

  const fetchComplaints = useCallback(async () => {
    if (!enabled) {
      setComplaints([]);
      setPagination(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params = { page, limit };
      if (mine) params.mine = true;
      if (priority && priority !== 'All') params.priority = priority;
      if (noPaginate) params.noPaginate = true;

      const { data } = await api.get('/complaints', { params });
      
      if (Array.isArray(data)) {
        setComplaints(data);
      } else {
        setComplaints(data.complaints || []);
        setPagination(data.pagination || null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load complaints.');
    } finally {
      setLoading(false);
    }
  }, [enabled, mine, priority, page, limit, noPaginate]);

  useEffect(() => {
    fetchComplaints();
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
