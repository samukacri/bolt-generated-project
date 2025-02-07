import { useState, useEffect } from 'react';

const useQuery = (url: string, options: RequestInit = {}, enabled: boolean = true) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isMounted = true; // To prevent setting state on unmounted component
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
      controller.abort(); // Abort fetch on unmount or re-run
    };
  }, [url, enabled, options]);

  return { data, error, isLoading };
};

export default useQuery;
