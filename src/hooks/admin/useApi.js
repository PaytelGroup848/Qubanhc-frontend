import { useState, useEffect } from 'react';

export default function useApi(endpoint, mockData = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API delay – replace with real axios call
        const response = await new Promise((resolve) => {
          setTimeout(() => resolve(mockData), 600);
        });
        if (!cancelled) {
          setData(response);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          if (mockData) setData(mockData);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [endpoint, mockData]);

  return { data, loading, error };
}