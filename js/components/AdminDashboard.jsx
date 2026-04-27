import React, { useState, useEffect } from 'react';
import StatCards from './StatCards';
import DonationTable from './DonationTable';
import { fetchDonations, updateDonationStatus } from '../services/api';

/**
 * AdminDashboard Component
 * Parent container for the admin control hub
 * Manages global state and orchestrates child components
 */
const AdminDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRecords: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  // Fetch donations on component mount
  useEffect(() => {
    loadDonations();
  }, []);

  // Calculate statistics from donations
  useEffect(() => {
    if (donations.length > 0) {
      const newStats = {
        totalRecords: donations.length,
        approved: donations.filter(d => d.status === 'approved').length,
        pending: donations.filter(d => d.status === 'pending').length,
        rejected: donations.filter(d => d.status === 'rejected').length,
      };
      setStats(newStats);
    }
  }, [donations]);

  /**
   * Load donations from API
   */
  const loadDonations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDonations();
      setDonations(data);
    } catch (err) {
      setError(err.message || 'Failed to load donations');
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle approve action
   * @param {string} donationId
   */
  const handleApprove = async (donationId) => {
    try {
      await updateDonationStatus(donationId, 'approved');
      // Update local state
      setDonations(prev =>
        prev.map(d => d.id === donationId ? { ...d, status: 'approved' } : d)
      );
    } catch (err) {
      setError(err.message || 'Failed to approve donation');
      console.error('Error approving donation:', err);
    }
  };

  /**
   * Handle reject action
   * @param {string} donationId
   */
  const handleReject = async (donationId) => {
    try {
      await updateDonationStatus(donationId, 'rejected');
      // Update local state
      setDonations(prev =>
        prev.map(d => d.id === donationId ? { ...d, status: 'rejected' } : d)
      );
    } catch (err) {
      setError(err.message || 'Failed to reject donation');
      console.error('Error rejecting donation:', err);
    }
  };

  /**
   * Handle refresh data
   */
  const handleRefresh = () => {
    loadDonations();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Control Hub</h1>
          <p className="mt-2 text-sm text-gray-600">Manage and approve donor records</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">
              <span className="font-semibold">Error:</span> {error}
            </p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-red-700 hover:text-red-900 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stat Cards */}
        <StatCards
          totalRecords={stats.totalRecords}
          approved={stats.approved}
          pending={stats.pending}
          rejected={stats.rejected}
        />

        {/* Refresh Button */}
        <div className="mt-8 mb-6 flex justify-end">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              loading
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>

        {/* Donation Table */}
        <DonationTable
          donations={donations}
          loading={loading}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
