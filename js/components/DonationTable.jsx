import React from 'react';
import ApprovalActions from './ApprovalActions';

/**
 * DonationTable Component
 * Displays list of donor records in table format
 */
const DonationTable = ({ donations, loading, onApprove, onReject }) => {
  if (loading && donations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="inline-block">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading donations...</p>
      </div>
    );
  }

  if (!donations || donations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-4xl mb-4">📭</div>
        <h3 className="text-lg font-semibold text-gray-900">No Donations Found</h3>
        <p className="mt-2 text-gray-600">There are no donor records to display at this time.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Donor Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Organization
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {donations.map((donation, index) => (
              <tr
                key={donation.id}
                className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {donation.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {donation.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <a
                    href={`mailto:${donation.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {donation.email}
                  </a>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  ${donation.amount?.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {donation.org}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(donation.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <StatusBadge status={donation.status} />
                </td>
                <td className="px-6 py-4 text-sm">
                  <ApprovalActions
                    donationId={donation.id}
                    status={donation.status}
                    onApprove={onApprove}
                    onReject={onReject}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Card Layout */}
      <div className="md:hidden">
        <div className="divide-y divide-gray-200">
          {donations.map((donation) => (
            <div
              key={donation.id}
              className="p-4 space-y-3 hover:bg-gray-50 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {donation.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">ID: {donation.id}</p>
                </div>
                <StatusBadge status={donation.status} />
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                  <a
                    href={`mailto:${donation.email}`}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    {donation.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Amount</p>
                  <p className="font-semibold text-gray-900">
                    ${donation.amount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Organization</p>
                  <p className="text-gray-900">{donation.org}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                  <p className="text-gray-900">
                    {new Date(donation.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-gray-200">
                <ApprovalActions
                  donationId={donation.id}
                  status={donation.status}
                  onApprove={onApprove}
                  onReject={onReject}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * StatusBadge Component
 * Visual indicator for donation status
 */
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: '⏱',
      label: 'Pending',
    },
    approved: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: '✓',
      label: 'Approved',
    },
    rejected: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: '✕',
      label: 'Rejected',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
};

export default DonationTable;
