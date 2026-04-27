/**
 * Mock Data
 * Sample donation data for development and testing
 */

export const MOCK_DONATIONS = [
  {
    id: 'DON001',
    name: 'KALVA PAVANI PRIYA',
    email: 'pavani.priya@email.com',
    phone: '+1-555-0101',
    amount: 500,
    date: '2026-02-20',
    status: 'pending',
    org: 'Food Aid Campaign',
    message: 'Helping families in need',
    createdAt: '2026-02-20T10:30:00Z',
    updatedAt: '2026-02-20T10:30:00Z',
  },
  {
    id: 'DON002',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0102',
    amount: 1000,
    date: '2026-02-19',
    status: 'approved',
    org: 'Education Initiative',
    message: 'Supporting education for underprivileged children',
    createdAt: '2026-02-19T14:20:00Z',
    updatedAt: '2026-02-19T15:45:00Z',
  },
  {
    id: 'DON003',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1-555-0103',
    amount: 750,
    date: '2026-02-18',
    status: 'pending',
    org: 'Healthcare Programs',
    message: 'Supporting medical services',
    createdAt: '2026-02-18T09:15:00Z',
    updatedAt: '2026-02-18T09:15:00Z',
  },
  {
    id: 'DON004',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    phone: '+1-555-0104',
    amount: 2000,
    date: '2026-02-17',
    status: 'rejected',
    org: 'Community Development',
    message: 'Community support project',
    createdAt: '2026-02-17T11:00:00Z',
    updatedAt: '2026-02-17T13:22:00Z',
  },
  {
    id: 'DON005',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0105',
    amount: 300,
    date: '2026-02-16',
    status: 'approved',
    org: 'Environmental Initiative',
    message: 'Protecting our environment',
    createdAt: '2026-02-16T16:45:00Z',
    updatedAt: '2026-02-16T17:30:00Z',
  },
  {
    id: 'DON006',
    name: 'Robert Chen',
    email: 'robert.chen@email.com',
    phone: '+1-555-0106',
    amount: 1500,
    date: '2026-02-15',
    status: 'pending',
    org: 'Disaster Relief',
    message: 'Emergency response fund',
    createdAt: '2026-02-15T12:10:00Z',
    updatedAt: '2026-02-15T12:10:00Z',
  },
  {
    id: 'DON007',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1-555-0107',
    amount: 600,
    date: '2026-02-14',
    status: 'approved',
    org: 'Mental Health Support',
    message: 'Supporting mental wellness',
    createdAt: '2026-02-14T08:30:00Z',
    updatedAt: '2026-02-14T10:15:00Z',
  },
  {
    id: 'DON008',
    name: 'Michael Thompson',
    email: 'michael.thompson@email.com',
    phone: '+1-555-0108',
    amount: 2500,
    date: '2026-02-13',
    status: 'pending',
    org: 'Research Foundation',
    message: 'Scientific advancement fund',
    createdAt: '2026-02-13T13:50:00Z',
    updatedAt: '2026-02-13T13:50:00Z',
  },
];

export const MOCK_STATS = {
  totalRecords: MOCK_DONATIONS.length,
  approved: MOCK_DONATIONS.filter(d => d.status === 'approved').length,
  pending: MOCK_DONATIONS.filter(d => d.status === 'pending').length,
  rejected: MOCK_DONATIONS.filter(d => d.status === 'rejected').length,
};

/**
 * Get mock donations (simulates API call)
 * @returns {Promise<Array>}
 */
export const getMockDonations = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DONATIONS);
    }, 500); // Simulate network delay
  });
};

/**
 * Get mock stats (simulates API call)
 * @returns {Promise<Object>}
 */
export const getMockStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_STATS);
    }, 300);
  });
};

/**
 * Update mock donation status
 * @param {string} donationId
 * @param {string} status
 * @returns {Promise<Object>}
 */
export const updateMockDonationStatus = (donationId, status) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const donation = MOCK_DONATIONS.find(d => d.id === donationId);
      if (donation) {
        donation.status = status;
        donation.updatedAt = new Date().toISOString();
        resolve(donation);
      } else {
        reject(new Error(`Donation ${donationId} not found`));
      }
    }, 300);
  });
};
