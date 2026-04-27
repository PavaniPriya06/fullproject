const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  let connection;

  try {
    console.log('🔄 Initializing database...\n');

    // Connect to MySQL (without database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306
    });

    console.log('✓ Connected to MySQL server');

    // Create database
    const dbName = process.env.DB_NAME || 'donation_hub';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✓ Database '${dbName}' created/verified`);

    // Use database
    await connection.query(`USE ${dbName}`);

    // Read and execute schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    let schema = await fs.readFile(schemaPath, 'utf8');

    // Remove the CREATE DATABASE and USE statements (we already did that)
    schema = schema
      .replace(/CREATE DATABASE.*?;/gi, '')
      .replace(/USE.*?;/gi, '');

    // Hash the admin password
    const adminPassword = 'Admin@123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Replace the placeholder password in schema
    schema = schema.replace('$2a$10$YourHashedPasswordHere', hashedPassword);

    // Split into individual statements and execute
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      try {
        await connection.query(statement);
      } catch (err) {
        // Ignore duplicate entry errors for admin user
        if (err.code !== 'ER_DUP_ENTRY') {
          throw err;
        }
      }
    }

    console.log('✓ Database schema created successfully');
    console.log('✓ Default admin user created');
    console.log('\n📧 Admin credentials:');
    console.log('   Email:    admin@donatehub.com');
    console.log('   Password: Admin@123');
    console.log('\n✅ Database initialization complete!\n');

  } catch (error) {
    console.error('\n❌ Error initializing database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run initialization
initializeDatabase();
