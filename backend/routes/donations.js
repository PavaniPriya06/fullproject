const express = require('express');
const { body } = require('express-validator');
const {
  createFoodDonation,
  createApparelDonation,
  createMoneyDonation,
  getMyDonations,
  getAllDonations,
  getStats,
  getDonation
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

const router = express.Router();

// Validation rules
const foodValidation = [
  body('riceQty').isInt({ min: 0 }).withMessage('Rice quantity must be a non-negative integer'),
  body('vegQty').isInt({ min: 0 }).withMessage('Vegetable quantity must be a non-negative integer'),
  body('fruitsQty').isInt({ min: 0 }).withMessage('Fruits quantity must be a non-negative integer'),
  body('trustId').notEmpty().withMessage('Trust ID is required')
];

const apparelValidation = [
  body('targetAge')
    .isInt()
    .isIn([10, 19, 20, 30, 45])
    .withMessage('Target age must be one of: 10, 19, 20, 30, 45')
];

const moneyValidation = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number')
];

// Public routes (protected by auth)
router.use(protect);

// Create donations
router.post('/food', foodValidation, validate, createFoodDonation);
router.post('/apparel', apparelValidation, validate, createApparelDonation);
router.post('/money', moneyValidation, validate, createMoneyDonation);

// Get user's own donations
router.get('/my-donations', getMyDonations);

// Get single donation
router.get('/:id', getDonation);

// Admin routes
router.get('/', authorize('admin'), getAllDonations);
router.get('/stats', authorize('admin'), getStats);

module.exports = router;
