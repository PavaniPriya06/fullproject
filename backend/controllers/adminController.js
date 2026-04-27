const Donation = require('../models/Donation');
const { formatDonation } = require('../utils/helpers');

// @desc    Approve donation
// @route   PUT /api/admin/donations/:id/approve
// @access  Private/Admin
exports.approveDonation = async (req, res, next) => {
  try {
    const donationId = req.params.id;
    const adminId = req.user.id;

    // Check if donation exists
    const donation = await Donation.getById(donationId);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Check if already processed
    if (donation.donation_status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Donation has already been ${donation.donation_status}`
      });
    }

    // Approve donation
    await Donation.approve(donationId, adminId);

    // Get updated donation
    const updatedDonation = await Donation.getById(donationId);

    res.status(200).json({
      success: true,
      message: 'Donation approved successfully',
      donation: formatDonation(updatedDonation)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject donation
// @route   PUT /api/admin/donations/:id/reject
// @access  Private/Admin
exports.rejectDonation = async (req, res, next) => {
  try {
    const donationId = req.params.id;
    const adminId = req.user.id;
    const { reason } = req.body;

    // Check if donation exists
    const donation = await Donation.getById(donationId);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Check if already processed
    if (donation.donation_status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Donation has already been ${donation.donation_status}`
      });
    }

    // Reject donation
    await Donation.reject(donationId, adminId, reason);

    // Get updated donation
    const updatedDonation = await Donation.getById(donationId);

    res.status(200).json({
      success: true,
      message: 'Donation rejected successfully',
      donation: formatDonation(updatedDonation)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const users = await User.getAll();

    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map(user => ({
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        totalDonated: parseFloat(user.total_donated),
        donationsCount: user.donations_count,
        joinedAt: user.joined_at
      }))
    });
  } catch (error) {
    next(error);
  }
};
