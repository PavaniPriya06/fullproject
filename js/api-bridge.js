/**
 * DONATION API - Frontend to Backend Bridge
 * Sends donation data to Node.js Express backend at http://localhost:5000
 */

(function (global) {
  'use strict';

  const API_URL = 'http://localhost:5000';

  /**
   * Get Bearer Token from localStorage or create a mock one
   */
  function getAuthToken() {
    const token = localStorage.getItem('auth_token');
    if (token) return token;
    // Return mock token if no token stored (for development)
    return 'mock-token-' + Date.now();
  }

  /**
   * Save Food Donation to Backend API and MySQL
   */
  async function saveFoodDonationToAPI(userId, riceQty, vegQty, fruitsQty, trustId) {
    try {
      console.log('📤 Saving food donation to backend...', {userId, riceQty, vegQty, fruitsQty, trustId});
      
      const payload = {
        riceQty: parseInt(riceQty, 10) || 0,
        vegQty: parseInt(vegQty, 10) || 0,
        fruitsQty: parseInt(fruitsQty, 10) || 0,
        trustId: trustId || 'trust_001'
      };

      console.log('📊 Payload:', payload);

      const response = await fetch(`${API_URL}/api/donations/food`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });

      console.log('📡 Response Status:', response.status);

      const data = await response.json();
      console.log('📥 Response Data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || `API Error: ${response.status}`);
      }

      const donationId = data.data?.id || data.id || 'donation-' + Date.now();
      console.log('✅ Food donation saved:', donationId);
      return { success: true, donationId };

    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  /**
   * Save Apparel Donation to Backend API and MySQL
   */
  async function saveApparelDonationToAPI(userId, targetAge) {
    try {
      console.log('📤 Saving apparel donation to backend...', {userId, targetAge});

      const payload = {
        targetAge: parseInt(targetAge, 10)
      };

      const response = await fetch(`${API_URL}/api/donations/apparel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `API Error: ${response.status}`);
      }

      const donationId = data.data?.id || data.id || 'donation-' + Date.now();
      console.log('✅ Apparel donation saved:', donationId);
      return { success: true, donationId };

    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  /**
   * Save Money Donation to Backend API and MySQL
   */
  async function saveMoneyDonationToAPI(userId, amount, transactionId, qrPayload) {
    try {
      console.log('📤 Saving money donation to backend...');

      const payload = {
        amount: parseFloat(amount) || 0
      };

      const response = await fetch(`${API_URL}/api/donations/money`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `API Error: ${response.status}`);
      }

      const donationId = data.data?.id || data.id || 'donation-' + Date.now();
      console.log('✅ Money donation saved:', donationId);
      return { success: true, donationId };

    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  /**
   * Fetch all donations from backend
   */
  async function fetchDonationsFromAPI() {
    try {
      const response = await fetch(`${API_URL}/api/donations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Donations fetched:', data);
      return data;

    } catch (error) {
      console.error('❌ Fetch Error:', error);
      throw error;
    }
  }

  // Export functions globally
  global.DonationAPI = {
    saveFoodDonation: saveFoodDonationToAPI,
    saveApparelDonation: saveApparelDonationToAPI,
    saveMoneyDonation: saveMoneyDonationToAPI,
    fetchDonations: fetchDonationsFromAPI
  };

})(window);
