import { useState, useCallback } from 'react';
import { JobFilters, SearchState } from '../types/filters';

export function useJobFilters() {
  const [searchState, setSearchState] = useState<SearchState>({
    searchTerm: '',
    filters: {}
  });

  const updateSearchTerm = useCallback((term: string) => {
    setSearchState(prev => ({ ...prev, searchTerm: term }));
  }, []);

  const updateFilters = useCallback((filters: JobFilters) => {
    setSearchState(prev => ({ ...prev, filters }));
  }, []);

  const resetFilters = useCallback(() => {
    setSearchState({ searchTerm: '', filters: {} });
  }, []);

  return {
    ...searchState,
    updateSearchTerm,
    updateFilters,
    resetFilters
  };
}