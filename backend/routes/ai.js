const express = require('express');
const { protect } = require('../middleware/auth');
const { 
  generateDonationSummary,
  getDonationRecommendations,
  getChatbotResponse,
  generateAnalytics 
} = require('../services/aiService');

const router = express.Router();

// All AI routes require authentication
router.use(protect);

/**
 * @route POST /api/ai/summary
 * @desc Generate AI summary for a donation
 * @access Private
 */
router.post('/summary', async (req, res, next) => {
  try {
    const { donation } = req.body;
    
    if (!donation) {
      return res.status(400).json({ 
        success: false, 
        message: 'Donation data required' 
      });
    }

    const summary = await generateDonationSummary(donation);
    
    res.status(200).json({
      success: true,
      summary: summary
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/ai/recommendations
 * @desc Get AI donation recommendations
 * @access Private
 */
router.post('/recommendations', async (req, res, next) => {
  try {
    const { donationHistory } = req.body;
    
    const recommendations = await getDonationRecommendations(
      donationHistory || []
    );
    
    res.status(200).json({
      success: true,
      recommendations: recommendations
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/ai/chat
 * @desc Get chatbot response
 * @access Private
 */
router.post('/chat', async (req, res, next) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message required' 
      });
    }

    const response = await getChatbotResponse(message, context);
    
    res.status(200).json({
      success: true,
      response: response
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/ai/analytics
 * @desc Get AI-powered donor analytics
 * @access Private
 */
router.post('/analytics', async (req, res, next) => {
  try {
    const { stats } = req.body;
    
    if (!stats) {
      return res.status(400).json({ 
        success: false, 
        message: 'Stats required' 
      });
    }

    const analytics = await generateAnalytics(stats);
    
    res.status(200).json({
      success: true,
      analytics: analytics
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
