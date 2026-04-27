const db = require('../config/database');

class User {
  // Create new user
  static async create(userData) {
    const { id, fullName, email, password, role = 'user' } = userData;
    const sql = `
      INSERT INTO users (id, full_name, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [id, fullName, email, password, role]);
    return result;
  }

  // Find user by email
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(sql, [email]);
    return rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  }

  // Update user stats after donation
  static async updateDonationStats(userId, amount = 0) {
    const sql = `
      UPDATE users 
      SET donations_count = donations_count + 1,
          total_donated = total_donated + ?
      WHERE id = ?
    `;
    const [result] = await db.execute(sql, [amount, userId]);
    return result;
  }

  // Get all users (admin only)
  static async getAll() {
    const sql = 'SELECT id, full_name, email, role, total_donated, donations_count, joined_at FROM users';
    const [rows] = await db.execute(sql);
    return rows;
  }
}

module.exports = User;
