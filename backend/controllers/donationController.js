const Donation = require('../models/Donation');
const User = require('../models/User');
const { generateId, formatDonation } = require('../utils/helpers');

// @desc    Create food donation
// @route   POST /api/donations/food
// @access  Private
exports.createFoodDonation = async (req, res, next) => {
  try {
    const { riceQty, vegQty, fruitsQty, trustId } = req.body;
    const userId = req.user.id;

    // Ensure user exists in database (for demo users)
    try {
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        // Create demo user if it doesn't exist
        await User.create({
          id: userId,
          fullName: req.user.fullName || 'Demo User',
          email: req.user.email || 'demo@example.com',
          password: 'demo',
          role: req.user.role || 'user'
        });
      }
    } catch (err) {
      console.log('Note: Demo user creation attempted');
    }

    // Create master donation record
    const donationId = generateId('dr');
    await Donation.create({
      id: donationId,
      userId,
      type: 'food',
      trustId: trustId || null
    });

    // Create food donation record
    const foodId = generateId('fd');
    await Donation.createFood({
      id: foodId,
      donationId,
      riceQty: parseInt(riceQty) || 0,
      vegQty: parseInt(vegQty) || 0,
      fruitsQty: parseInt(fruitsQty) || 0
    });

    // Update user stats (optional)
    try {
      await User.updateDonationStats(userId);
    } catch (err) {
      console.log('Note: Could not update user stats');
    }

    res.status(201).json({
      success: true,
      message: 'Food donation submitted successfully',
      data: {
        id: donationId,
        type: 'food',
        status: 'pending'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create apparel donation
// @route   POST /api/donations/apparel
// @access  Private
exports.createApparelDonation = async (req, res, next) => {
  try {
    const { targetAge } = req.body;
    const userId = req.user.id;

    // Validate target age
    const validAges = [10, 19, 20, 30, 45];
    if (!validAges.includes(parseInt(targetAge))) {
      return res.status(400).json({
        success: false,
        message: `Target age must be one of: ${validAges.join(', ')}`
      });
    }

    // Ensure user exists in database (for demo users)
    try {
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        await User.create({
          id: userId,
          fullName: req.user.fullName || 'Demo User',
          email: req.user.email || 'demo@example.com',
          password: 'demo',
          role: req.user.role || 'user'
        });
      }
    } catch (err) {
      console.log('Note: Demo user creation attempted');
    }

    // Create master donation record
    const donationId = generateId('dr');
    await Donation.create({
      id: donationId,
      userId,
      type: 'apparel'
    });

    // Create apparel donation record
    const apparelId = generateId('cd');
    await Donation.createApparel({
      id: apparelId,
      donationId,
      targetAge: parseInt(targetAge)
    });

    // Update user stats (optional)
    try {
      await User.updateDonationStats(userId);
    } catch (err) {
      console.log('Note: Could not update user stats');
    }

    res.status(201).json({
      success: true,
      message: 'Apparel donation submitted successfully',
      data: {
        id: donationId,
        type: 'apparel',
        status: 'pending'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create money donation
// @route   POST /api/donations/money
// @access  Private
exports.createMoneyDonation = async (req, res, next) => {
  try {
    const { amount, qrPayload } = req.body;
    const userId = req.user.id;

    // Ensure user exists in database (for demo users)
    try {
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        await User.create({
          id: userId,
          fullName: req.user.fullName || 'Demo User',
          email: req.user.email || 'demo@example.com',
          password: 'demo',
          role: req.user.role || 'user'
        });
      }
    } catch (err) {
      console.log('Note: Demo user creation attempted');
    }

    // Create master donation record
    const donationId = generateId('dr');
    await Donation.create({
      id: donationId,
      userId,
      type: 'money'
    });

    // Create money donation record
    const moneyId = generateId('md');
    const transactionId = `TXN-${Date.now()}`;
    await Donation.createMoney({
      id: moneyId,
      donationId,
      transactionId,
      amount: parseFloat(amount) || 0,
      qrPayload: qrPayload || null
    });

    // Update user stats (optional)
    try {
      await User.updateDonationStats(userId, parseFloat(amount));
    } catch (err) {
      console.log('Note: Could not update user stats');
    }

    res.status(201).json({
      success: true,
      message: 'Money donation submitted successfully',
      data: {
        id: donationId,
        type: 'money',
        status: 'pending',
        amount: parseFloat(amount)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations for logged in user
// @route   GET /api/donations/my-donations
// @access  Private
exports.getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.getByUserId(req.user.id);

    res.status(200).json({
      success: true,
      count: donations.length,
      donations: donations.map(formatDonation)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations (admin only)
// @route   GET /api/donations
// @access  Private/Admin
exports.getAllDonations = async (req, res, next) => {
  try {
    const donations = await Donation.getAll();

    res.status(200).json({
      success: true,
      count: donations.length,
      donations: donations.map(formatDonation)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donation statistics
// @route   GET /api/donations/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  try {
    const stats = await Donation.getStats();

    res.status(200).json({
      success: true,
      stats: {
        totalRecords: parseInt(stats.total_records),
        approved: parseInt(stats.approved),
        pending: parseInt(stats.pending),
        rejected: parseInt(stats.rejected)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single donation
// @route   GET /api/donations/:id
// @access  Private
exports.getDonation = async (req, res, next) => {
  try {
    const donation = await Donation.getById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Check ownership (users can only see their own, admins can see all)
    if (req.user.role !== 'admin' && donation.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this donation'
      });
    }

    res.status(200).json({
      success: true,
      donation: formatDonation(donation)
    });
  } catch (error) {
    next(error);
  }
};
