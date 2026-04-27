const db = require('../config/database');

class Donation {
  // Create master donation record
  static async create(donationData) {
    const { id, userId, type, trustId, donationStatus = 'pending' } = donationData;
    const sql = `
      INSERT INTO donations (id, user_id, type, trust_id, donation_status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [id, userId, type, trustId || null, donationStatus]);
    return result;
  }

  // Create food donation
  static async createFood(foodData) {
    const { id, donationId, riceQty, vegQty, fruitsQty } = foodData;
    const sql = `
      INSERT INTO food_donations (id, donation_id, rice_qty, veg_qty, fruits_qty)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [id, donationId, riceQty, vegQty, fruitsQty]);
    return result;
  }

  // Create apparel donation
  static async createApparel(apparelData) {
    const { id, donationId, targetAge } = apparelData;
    const sql = `
      INSERT INTO apparel_donations (id, donation_id, target_age)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.execute(sql, [id, donationId, targetAge]);
    return result;
  }

  // Create money donation
  static async createMoney(moneyData) {
    const { id, donationId, transactionId, amount, qrPayload } = moneyData;
    const sql = `
      INSERT INTO money_donations (id, donation_id, transaction_id, amount, qr_payload, payment_status)
      VALUES (?, ?, ?, ?, ?, TRUE)
    `;
    const [result] = await db.execute(sql, [id, donationId, transactionId, amount, qrPayload]);
    return result;
  }

  // Get all donations (admin view)
  static async getAll() {
    const sql = `
      SELECT 
        d.*,
        u.full_name as donor_name,
        u.email as donor_email,
        f.rice_qty, f.veg_qty, f.fruits_qty,
        a.target_age,
        m.transaction_id, m.amount
      FROM donations d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN food_donations f ON d.id = f.donation_id
      LEFT JOIN apparel_donations a ON d.id = a.donation_id
      LEFT JOIN money_donations m ON d.id = m.donation_id
      ORDER BY d.created_at DESC
    `;
    const [rows] = await db.execute(sql);
    return rows;
  }

  // Get donations by user
  static async getByUserId(userId) {
    const sql = `
      SELECT 
        d.*,
        f.rice_qty, f.veg_qty, f.fruits_qty,
        a.target_age,
        m.transaction_id, m.amount
      FROM donations d
      LEFT JOIN food_donations f ON d.id = f.donation_id
      LEFT JOIN apparel_donations a ON d.id = a.donation_id
      LEFT JOIN money_donations m ON d.id = m.donation_id
      WHERE d.user_id = ?
      ORDER BY d.created_at DESC
    `;
    const [rows] = await db.execute(sql, [userId]);
    return rows;
  }

  // Get donation by ID
  static async getById(id) {
    const sql = `
      SELECT 
        d.*,
        u.full_name as donor_name,
        u.email as donor_email,
        f.rice_qty, f.veg_qty, f.fruits_qty,
        a.target_age,
        m.transaction_id, m.amount
      FROM donations d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN food_donations f ON d.id = f.donation_id
      LEFT JOIN apparel_donations a ON d.id = a.donation_id
      LEFT JOIN money_donations m ON d.id = m.donation_id
      WHERE d.id = ?
    `;
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  }

  // Approve donation
  static async approve(donationId, adminId) {
    const sql = `
      UPDATE donations 
      SET donation_status = 'approved',
          approved_by = ?,
          approved_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    const [result] = await db.execute(sql, [adminId, donationId]);
    return result;
  }

  // Reject donation
  static async reject(donationId, adminId, reason = null) {
    const sql = `
      UPDATE donations 
      SET donation_status = 'rejected',
          approved_by = ?,
          approved_at = CURRENT_TIMESTAMP,
          rejection_reason = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(sql, [adminId, reason, donationId]);
    return result;
  }

  // Get statistics
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_records,
        SUM(CASE WHEN donation_status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN donation_status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN donation_status = 'rejected' THEN 1 ELSE 0 END) as rejected
      FROM donations
    `;
    const [rows] = await db.execute(sql);
    return rows[0];
  }
}

module.exports = Donation;
