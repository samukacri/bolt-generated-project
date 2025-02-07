import { useState, useEffect } from 'react';

const useFetch = (url: string | null, options: RequestInit = {}, enabled: boolean = true) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!enabled || !url) {
        setData(null);
        setError(null);
        setIsLoading(false);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(url, { ...options, signal });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        if (isMounted) {
          setData(json);
        }
      } catch (err: any) {
        if (isMounted) {
          if (err.name === 'AbortError') {
            console.log('fetch aborted');
          } else {
            setError(err);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [url, enabled, options]);

  return { data, error, isLoading };
};

export default useFetch;
