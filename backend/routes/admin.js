const express = require('express');
const { body } = require('express-validator');
const {
  approveDonation,
  rejectDonation,
  getAllUsers
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

const router = express.Router();

// All admin routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// Donation management
router.put('/donations/:id/approve', approveDonation);
router.put(
  '/donations/:id/reject',
  [body('reason').optional().isString().withMessage('Reason must be a string')],
  validate,
  rejectDonation
);

// User management
router.get('/users', getAllUsers);

module.exports = router;
