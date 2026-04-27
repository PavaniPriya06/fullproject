const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
});

/**
 * Generate AI-powered donation summary
 * @param {string} donationData - Donation details
 * @returns {Promise<string>} AI-generated summary
 */
exports.generateDonationSummary = async (donationData) => {
  try {
    const prompt = `Summarize this donation in a friendly, engaging way for social media:
${JSON.stringify(donationData, null, 2)}

Make it motivational and highlight the impact of this donation.`;

    const message = await openai.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }]
    });

    return message.content[0].text;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
};

/**
 * Get AI donation recommendations based on user history
 * @param {Array} userDonationHistory - User's past donations
 * @returns {Promise<Array>} Recommendations
 */
exports.getDonationRecommendations = async (userDonationHistory) => {
  try {
    const prompt = `Based on this user's donation history, suggest 3 specific donation recommendations:
${JSON.stringify(userDonationHistory, null, 2)}

Return as JSON array with: type (food/apparel/money), reason (why this donation), amount/details.`;

    const message = await openai.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    });

    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
};

/**
 * AI Chatbot response
 * @param {string} userMessage - User's question
 * @param {Object} context - Additional context (donations, stats, etc)
 * @returns {Promise<string>} Chatbot response
 */
exports.getChatbotResponse = async (userMessage, context = {}) => {
  try {
    const systemPrompt = `You are a friendly AI assistant for DonateHub, a donation management platform. 
Help users with:
- Creating different types of donations (food, apparel, money)
- Understanding donation impact and benefits
- Getting donation tips and encouragement
- Answering questions about the platform

Keep responses short (under 150 words) and friendly.`;

    const contextStr = Object.keys(context).length > 0 
      ? `\n\nUser context: ${JSON.stringify(context)}`
      : '';

    const message = await openai.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage + contextStr }]
    });

    return message.content[0].text;
  } catch (error) {
    console.error('Error in chatbot:', error);
    throw error;
  }
};

/**
 * Generate donor analytics insights
 * @param {Object} donorStats - Donor statistics
 * @returns {Promise<Object>} Analytics insights
 */
exports.generateAnalytics = async (donorStats) => {
  try {
    const prompt = `Analyze these donor statistics and provide insights:
${JSON.stringify(donorStats, null, 2)}

Return JSON with:
- insight (key finding)
- trend (donation trend)
- recommendation (what donor should do next)
- impact (estimated impact of donations)`;

    const message = await openai.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }]
    });

    const responseText = message.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { insight: responseText };
  } catch (error) {
    console.error('Error generating analytics:', error);
    return { insight: 'Analytics unavailable', error: error.message };
  }
};
