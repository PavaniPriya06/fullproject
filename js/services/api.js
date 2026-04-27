/**
 * API Service - DonateHub
 * Handles all API calls for donation management
 * Backend: http://localhost:5000/api
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Get authentication token from localStorage
 * @returns {string|null} JWT token
 */
const getAuthToken = () => {
  try {
    const session = JSON.parse(localStorage.getItem('dms_session') || '{}');
    return session.token || null;
  } catch (e) {
    return null;
  }
};

/**
 * Get default headers with auth token
 * @returns {Object} Headers object
 */
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Handle API response
 * @param {Response} response
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }
  return response.json();
};

/**
 * Fetch all donations (Admin only)
 * @returns {Promise<Array>} List of donations
 */
export const fetchDonations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/donations`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await handleResponse(response);
    return data.data || data || [];
  } catch (error) {
    console.error('Error fetching donations:', error);
    throw error;
  }
};

/**
 * Fetch donation statistics (Admin only)
 * @returns {Promise<Object>} Statistics object
 */
export const fetchDonationStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/donations/stats`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await handleResponse(response);
    return data.data || data || {};
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};

/**
 * DEPRECATED: Use approveDonation() or rejectDonation() instead
 * Update donation status (Old method - kept for backward compatibility)
 * @param {string} donationId
 * @param {string} status - 'approved' or 'rejected'
 * @returns {Promise<Object>} Updated donation
 */
export const updateDonationStatus = async (donationId, status) => {
  try {
    if (!['approved', 'rejected'].includes(status)) {
      throw new Error('Invalid status. Must be "approved" or "rejected"');
    }

    // Route through new endpoints
    if (status === 'approved') {
      return await approveDonation(donationId);
    } else {
      return await rejectDonation(donationId);
    }
  } catch (error) {
    console.error('Error updating donation:', error);
    throw error;
  }
};

/**
 * Get single donation by ID
 * @param {string} donationId
 * @returns {Promise<Object>} Donation object
 */
export const fetchDonationById = async (donationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/donations/${donationId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await handleResponse(response);
    return data.data || data || {};
  } catch (error) {
    console.error('Error fetching donation:', error);
    throw error;
  }
};

/**
 * Search donations
 * @param {string} query - Search query
 * @returns {Promise<Array>} Filtered donations
 */
export const searchDonations = async (query) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/donations/search?q=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );
    const data = await handleResponse(response);
    return data.data || data || [];
  } catch (error) {
    console.error('Error searching donations:', error);
    throw error;
  }
};

/**
 * Filter donations by criteria
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Filtered donations
 */
export const filterDonations = async (filters) => {
  try {
    const queryParams = new URLSearchParams(
      Object.entries(filters).filter(([_, value]) => value !== undefined)
    );

    const response = await fetch(
      `${API_BASE_URL}/donations?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );
    const data = await handleResponse(response);
    return data.data || data || [];
  } catch (error) {
    console.error('Error filtering donations:', error);
    throw error;
  }
};

/**
 * Export donations to CSV
 * @param {Array} donations
 * @returns {Blob}
 */
export const exportDonationsToCSV = (donations) => {
  try {
    const headers = [
      'ID',
      'Name',
      'Email',
      'Amount',
      'Organization',
      'Date',
      'Status',
    ];

    const rows = donations.map(d => [
      d.id,
      d.name,
      d.email,
      d.amount,
      d.org,
      d.date,
      d.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `donations_${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};

/* ═══════════════════════════════════════════════════════════
   AUTHENTICATION ENDPOINTS
   ═══════════════════════════════════════════════════════════ */

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.fullName - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} Registered user data
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    const data = await handleResponse(response);
    // Store token if provided
    if (data.token) {
      localStorage.setItem('dms_session', JSON.stringify({
        token: data.token,
        user: data.user,
      }));
    }
    return data.user || data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and token
 */
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    // Store token and user info
    if (data.token) {
      localStorage.setItem('dms_session', JSON.stringify({
        token: data.token,
        user: data.user,
        loginAt: new Date().toISOString(),
      }));
    }
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Get current user profile
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await handleResponse(response);
    return data.user || data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(),
    });
    localStorage.removeItem('dms_session');
  } catch (error) {
    console.error('Error logging out:', error);
    // Still remove session even if API call fails
    localStorage.removeItem('dms_session');
    throw error;
  }
};

/* ═══════════════════════════════════════════════════════════
   DONATION CREATION ENDPOINTS
   ═══════════════════════════════════════════════════════════ */

/**
 * Create a food donation
 * @param {Object} donationData - Food donation details
 * @param {number} donationData.riceQty - Quantity of rice
 * @param {number} donationData.vegQty - Quantity of vegetables
 * @param {number} donationData.fruitsQty - Quantity of fruits
 * @param {string} donationData.trustId - Trust ID
 * @returns {Promise<Object>} Created donation
 */
export const createFoodDonation = async (donationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/donations/food`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(donationData),
    });
    const data = await handleResponse(response);
    return data.donation || data;
  } catch (error) {
    console.error('Error creating food donation:', error);
    throw error;
  }
};

/**
 * Create an apparel donation
 * @param {Object} donationData - Apparel donation details
 * @param {number} donationData.targetAge - Target age group (10, 19, 20, 30, 45)
 * @param {number} donationData.quantity - Quantity of apparel items
 * @returns {Promise<Object>} Created donation
 */
export const createApparelDonation = async (donationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/donations/apparel`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(donationData),
    });
    const data = await handleResponse(response);
    return data.donation || data;
  } catch (error) {
    console.error('Error creating apparel donation:', error);
    throw error;
  }
};

/**
 * Create a money donation
 * @param {Object} donationData - Money donation details
 * @param {number} donationData.amount - Donation amount
 * @returns {Promise<Object>} Created donation
 */
export const createMoneyDonation = async (donationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/donations/money`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(donationData),
    });
    const data = await handleResponse(response);
    return data.donation || data;
  } catch (error) {
    console.error('Error creating money donation:', error);
    throw error;
  }
};

/**
 * Get user's own donations
 * @returns {Promise<Array>} User's donations
 */
export const getMyDonations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/donations/my-donations`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await handleResponse(response);
    return data.donations || data.data || data || [];
  } catch (error) {
    console.error('Error fetching my donations:', error);
    throw error;
  }
};

/* ═══════════════════════════════════════════════════════════
   ADMIN ENDPOINTS - APPROVAL & REJECTION
   ═══════════════════════════════════════════════════════════ */

/**
 * Approve a donation (Admin only)
 * @param {string} donationId - ID of donation to approve
 * @returns {Promise<Object>} Updated donation
 */
export const approveDonation = async (donationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/donations/${donationId}/approve`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    const data = await handleResponse(response);
    return data.donation || data;
  } catch (error) {
    console.error('Error approving donation:', error);
    throw error;
  }
};

/**
 * Reject a donation (Admin only)
 * @param {string} donationId - ID of donation to reject
 * @param {string} reason - Optional reason for rejection
 * @returns {Promise<Object>} Updated donation
 */
export const rejectDonation = async (donationId, reason = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/donations/${donationId}/reject`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ reason }),
    });
    const data = await handleResponse(response);
    return data.donation || data;
  } catch (error) {
    console.error('Error rejecting donation:', error);
    throw error;
  }
};

/* ═══════════════════════════════════════════════════════════
   ADMIN ENDPOINTS - USER MANAGEMENT
   ═══════════════════════════════════════════════════════════ */

/**
 * Get all users (Admin only)
 * @returns {Promise<Array>} List of all users
 */
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: getHeaders(),
    });
    const data = await handleResponse(response);
    return data.users || data.data || data || [];
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};
