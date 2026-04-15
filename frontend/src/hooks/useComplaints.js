import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client.js';

const useComplaints = ({ mine = false, priority = '', enabled = true } = {}) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(enabled);

  const fetchComplaints = useCallback(async () => {
    if (!enabled) {
      setComplaints([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params = {};
      if (mine) {
        params.mine = true;
      }
      if (priority && priority !== 'All') {
        params.priority = priority;
      }

      const { data } = await api.get('/complaints', { params });
      setComplaints(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load complaints.');
    } finally {
      setLoading(false);
    }
  }, [enabled, mine, priority]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  return {
    complaints,
    setComplaints,
    loading,
    refetch: fetchComplaints
  };
};

export default useComplaints;
