const jwt = require('jsonwebtoken');

// Generate unique ID
exports.generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
};

// Sign JWT token
exports.signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Send token response
exports.sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = exports.signToken(user.id);

  // Response data
  const userData = {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    totalDonated: parseFloat(user.total_donated),
    donationsCount: user.donations_count
  };

  res.status(statusCode).json({
    success: true,
    token,
    user: userData
  });
};

// Format donation response
exports.formatDonation = (donation) => {
  const formatted = {
    id: donation.id,
    userId: donation.user_id,
    type: donation.type,
    status: donation.donation_status,
    createdAt: donation.created_at,
    updatedAt: donation.updated_at
  };

  // Add donor info if available
  if (donation.donor_name) {
    formatted.donor = {
      name: donation.donor_name,
      email: donation.donor_email
    };
  }

  // Add type-specific data
  if (donation.type === 'food') {
    formatted.details = {
      riceQty: donation.rice_qty,
      vegQty: donation.veg_qty
    };
  } else if (donation.type === 'apparel') {
    formatted.details = {
      targetAge: donation.target_age
    };
  } else if (donation.type === 'money') {
    formatted.details = {
      transactionId: donation.transaction_id,
      amount: parseFloat(donation.amount)
    };
  }

  // Add approval info if available
  if (donation.approved_by) {
    formatted.approvedBy = donation.approved_by;
    formatted.approvedAt = donation.approved_at;
  }

  if (donation.rejection_reason) {
    formatted.rejectionReason = donation.rejection_reason;
  }

  return formatted;
};
