/**
 * Utility Functions
 * Helper functions for formatting and common operations
 */

/**
 * Format date to readable string
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Format date and time to readable string
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Format currency value
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    return `$${amount?.toLocaleString() || '0'}`;
  }
};

/**
 * Format phone number
 * @param {string} phone
 * @returns {string}
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Validate email
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate phone number
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Get status color
 * @param {string} status
 * @returns {string}
 */
export const getStatusColor = (status) => {
  const colors = {
    pending: 'yellow',
    approved: 'green',
    rejected: 'red',
  };
  return colors[status] || 'gray';
};

/**
 * Get status icon
 * @param {string} status
 * @returns {string}
 */
export const getStatusIcon = (status) => {
  const icons = {
    pending: '⏱',
    approved: '✓',
    rejected: '✕',
  };
  return icons[status] || '—';
};

/**
 * Sort array by key
 * @param {Array} arr
 * @param {string} key
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array}
 */
export const sortBy = (arr, key, order = 'asc') => {
  const sorted = [...arr].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
};

/**
 * Filter array by multiple criteria
 * @param {Array} arr
 * @param {Object} criteria
 * @returns {Array}
 */
export const filterBy = (arr, criteria) => {
  return arr.filter(item =>
    Object.entries(criteria).every(([key, value]) => {
      if (!value) return true;
      if (key === 'searchTerm') {
        return JSON.stringify(item).toLowerCase().includes(value.toLowerCase());
      }
      return item[key] === value;
    })
  );
};

/**
 * Group array by key
 * @param {Array} arr
 * @param {string} key
 * @returns {Object}
 */
export const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    const groupKey = item[key];
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {});
};

/**
 * Calculate statistics from donations
 * @param {Array} donations
 * @returns {Object}
 */
export const calculateStats = (donations) => {
  const stats = {
    totalRecords: donations.length,
    totalAmount: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    averageAmount: 0,
    maxAmount: 0,
    minAmount: Infinity,
  };

  donations.forEach(d => {
    stats.totalAmount += d.amount || 0;
    stats[d.status]++;
    stats.maxAmount = Math.max(stats.maxAmount, d.amount || 0);
    stats.minAmount = Math.min(stats.minAmount, d.amount || 0);
  });

  stats.averageAmount = stats.totalRecords > 0 ? stats.totalAmount / stats.totalRecords : 0;
  stats.minAmount = stats.minAmount === Infinity ? 0 : stats.minAmount;
  stats.approvalRate = stats.totalRecords > 0 ? ((stats.approved / stats.totalRecords) * 100).toFixed(2) : 0;

  return stats;
};

/**
 * Debounce function
 * @param {Function} func
 * @param {number} delay
 * @returns {Function}
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function
 * @param {Function} func
 * @param {number} delay
 * @returns {Function}
 */
export const throttle = (func, delay = 300) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

/**
 * Check if array is empty
 * @param {Array} arr
 * @returns {boolean}
 */
export const isEmpty = (arr) => {
  return !arr || arr.length === 0;
};

/**
 * Generate unique ID
 * @returns {string}
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Copy text to clipboard
 * @param {string} text
 * @returns {Promise<void>}
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get initials from name
 * @param {string} name
 * @returns {string}
 */
export const getInitials = (name) => {
  return name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '';
};

/**
 * Truncate string
 * @param {string} str
 * @param {number} length
 * @returns {string}
 */
export const truncate = (str, length = 50) => {
  if (!str) return '';
  return str.length > length ? `${str.substring(0, length)}...` : str;
};
