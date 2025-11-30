import {
    useState,
    useEffect,
    useCallback
} from 'react';
import {
    get
} from '../api/api';

/**
 * Custom hook for fetching data from an API endpoint
 * @param {string} url - The API endpoint URL to fetch from
 * @param {object} params - Optional query parameters
 * @param {boolean} immediate - Whether to fetch immediately on mount (default: true)
 * @returns {object} { data, loading, error, refetch }
 */
const useFetch = (url, params = {}, immediate = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);

    // Fetch function that can be called manually or automatically
    const fetchData = useCallback(async () => {
        if (!url) {
            setError('No URL provided');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const result = await get(url, params);
            setData(result);
        } catch (err) {
            setError(err.message || 'An error occurred while fetching data');
            console.error('useFetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [url, params]);

    // Refetch function to manually trigger a new fetch
    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    // Fetch data on mount if immediate is true
    useEffect(() => {
        if (immediate) {
            fetchData();
        }
    }, [fetchData, immediate]);

    return {
        data,
        loading,
        error,
        refetch
    };
};

export default useFetch;