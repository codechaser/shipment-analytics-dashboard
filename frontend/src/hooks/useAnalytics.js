import { useEffect, useRef, useState } from 'react';
import { fetchAnalytics, ingestSourceData } from '../services/api.js';

export function useAnalytics(filters) {
  const ingestionPromise = useRef(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError(null);

      try {
        if (!ingestionPromise.current) {
          ingestionPromise.current = ingestSourceData();
        }
        await ingestionPromise.current;
        const nextData = await fetchAnalytics(filters, controller.signal);
        if (active) setData(nextData);
      } catch (requestError) {
        if (active && requestError.name !== 'CanceledError' && requestError.code !== 'ERR_CANCELED') {
          setError(requestError.response?.data?.error || requestError.message || 'Unable to load dashboard data.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      active = false;
      controller.abort();
    };
  }, [filters, refreshKey]);

  return {
    data,
    error,
    loading,
    refresh: () => {
      ingestionPromise.current = null;
      setRefreshKey((key) => key + 1);
    }
  };
}
