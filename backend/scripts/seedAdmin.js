const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function seedAdmin() {
  try {
    console.log('🔄 Seeding admin user...\n');

    // Check if admin exists
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', ['admin123@gmail.com']);
    
    if (existing.length > 0) {
      console.log('✓ Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const password = 'pavani123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin user
    await db.query(
      'INSERT INTO users (id, full_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      ['u_admin_' + Date.now(), 'System Administrator', 'admin123@gmail.com', hashedPassword, 'admin']
    );

    console.log('✓ Admin user created successfully');
    console.log('\n📧 Admin credentials:');
    console.log('   Email:    admin123@gmail.com');
    console.log('   Password: pavani123');
    console.log('\n✅ Done!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedAdmin();
