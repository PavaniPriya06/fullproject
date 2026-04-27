import { useState, useEffect, useCallback } from 'react';
import {
  fetchDonations,
  fetchDonationStats,
  updateDonationStatus,
  searchDonations,
  filterDonations,
} from '../services/api';

/**
 * Custom Hook: useDonations
 * Manages donation data and state
 */
export const useDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  /**
   * Load donations from API
   */
  const loadDonations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDonations();
      setDonations(data);
    } catch (err) {
      setError(err.message || 'Failed to load donations');
      console.error('Error in useDonations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load statistics
   */
  const loadStats = useCallback(async () => {
    try {
      const data = await fetchDonationStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);

  /**
   * Approve donation
   */
  const approveDonation = useCallback(
    async (donationId) => {
      try {
        await updateDonationStatus(donationId, 'approved');
        setDonations(prev =>
          prev.map(d => d.id === donationId ? { ...d, status: 'approved' } : d)
        );
      } catch (err) {
        setError(err.message || 'Failed to approve donation');
        throw err;
      }
    },
    []
  );

  /**
   * Reject donation
   */
  const rejectDonation = useCallback(
    async (donationId) => {
      try {
        await updateDonationStatus(donationId, 'rejected');
        setDonations(prev =>
          prev.map(d => d.id === donationId ? { ...d, status: 'rejected' } : d)
        );
      } catch (err) {
        setError(err.message || 'Failed to reject donation');
        throw err;
      }
    },
    []
  );

  /**
   * Search donations
   */
  const search = useCallback(async (query) => {
    if (!query.trim()) {
      loadDonations();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const results = await searchDonations(query);
      setDonations(results);
    } catch (err) {
      setError(err.message || 'Search failed');
      console.error('Error searching donations:', err);
    } finally {
      setLoading(false);
    }
  }, [loadDonations]);

  /**
   * Filter donations
   */
  const filter = useCallback(async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const results = await filterDonations(filters);
      setDonations(results);
    } catch (err) {
      setError(err.message || 'Filter failed');
      console.error('Error filtering donations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load donations on mount
  useEffect(() => {
    loadDonations();
    loadStats();
  }, [loadDonations, loadStats]);

  return {
    donations,
    loading,
    error,
    stats,
    loadDonations,
    loadStats,
    approveDonation,
    rejectDonation,
    search,
    filter,
    clearError,
  };
};

/**
 * Custom Hook: useDonationFilters
 * Manages filter state and logic
 */
export const useDonationFilters = () => {
  const [filters, setFilters] = useState({
    status: '', // 'pending', 'approved', 'rejected'
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
  });

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      status: '',
      searchTerm: '',
      dateFrom: '',
      dateTo: '',
    });
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
  };
};

/**
 * Custom Hook: useAsyncAction
 * Helper for managing async operations with loading and error states
 */
export const useAsyncAction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (asyncFn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError,
    setError,
  };
};
