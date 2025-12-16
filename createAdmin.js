require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./models');
const User = db.User;

async function createAdmin() {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const password = 'admin123'; // In production, use a secure password
    const hash = await bcrypt.hash(password, 10);
    
    await User.create({
      username: 'admin',
      password_hash: hash,
      role: 'admin'
    });

    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdmin();
