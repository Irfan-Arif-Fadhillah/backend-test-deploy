require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./models');
const User = db.User;

const USERS = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'user1', password: 'user123', role: 'user' },
  { username: 'user2', password: 'user123', role: 'user' }
];

async function setupUsers() {
  try {
    // Authenticate with the database
    await db.sequelize.authenticate();
    console.log('Database connected!');

    // Create users if they don't exist
    for (const user of USERS) {
      const [userRecord, created] = await User.findOrCreate({
        where: { username: user.username },
        defaults: {
          username: user.username,
          password_hash: await bcrypt.hash(user.password, 10),
          role: user.role
        }
      });

      if (created) {
        console.log(`Created user: ${user.username} (${user.role})`);
      } else {
        console.log(`User already exists: ${user.username} (${user.role})`);
      }
    }

    console.log('\nSetup complete! Users:');
    console.log('Admin:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('\nRegular Users:');
    console.log('  Username: user1, Password: user123');
    console.log('  Username: user2, Password: user123');
    console.log('\n⚠️  IMPORTANT: Change these passwords after first login!');

  } catch (error) {
    console.error('Error setting up users:', error.message);
  } finally {
    process.exit(0);
  }
}

setupUsers();
