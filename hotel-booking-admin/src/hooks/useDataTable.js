import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Drives a server-paginated list: fetches `service.list({ page, limit, search, ...extraParams })`
 * whenever page/limit/search/extraParams change, with search debounced.
 */
export function useDataTable(listFn, { limit: initialLimit = 20, extraParams = {} } = {}) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);
  const extraParamsKey = JSON.stringify(extraParams);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await listFn({ page, limit, search: search || undefined, ...extraParams });
      setRows(response.data || []);
      setTotal(response.meta?.total ?? (response.data ? response.data.length : 0));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, extraParamsKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (value) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      setSearch(value);
    }, 350);
  };

  return {
    rows,
    total,
    page,
    limit,
    loading,
    error,
    setPage,
    setLimit,
    onSearch: handleSearch,
    refetch: fetchData,
  };
}

export default useDataTable;
