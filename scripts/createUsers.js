require('dotenv').config();
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');

// Gunakan kredensial postgres untuk create users (punya full permission)
const sequelize = new Sequelize(
    'dasar_backend_dev',  // database
    'postgres',           // username
    'postgres123',       // password
    {
        host: process.env.PGHOST || 'localhost',
        port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
        dialect: 'postgres',
        logging: false,
    }
);

// Import model User
const User = sequelize.define('User', {
    id: {
        type: require('sequelize').DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: require('sequelize').DataTypes.STRING(50),
        unique: true,
        allowNull: false,
    },
    password_hash: {
        type: require('sequelize').DataTypes.TEXT,
        allowNull: false,
    },
    role: {
        type: require('sequelize').DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user',
    },
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

async function createUsers() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful (using postgres user).\n');

    const users = [
      {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        description: 'Full Access - CRUD semua data'
      },
      {
        username: 'user',
        password: 'user123',
        role: 'user',
        description: 'Read-Only - Hanya melihat data'
      }
    ];

    console.log('🔄 Creating users...\n');

    for (const userData of users) {
      const existingUser = await User.findOne({ where: { username: userData.username } });
      
      if (existingUser) {
        // Update existing user
        const hash = await bcrypt.hash(userData.password, 10);
        existingUser.password_hash = hash;
        existingUser.role = userData.role;
        await existingUser.save();
        console.log(`🔄 User "${userData.username}" updated successfully!`);
      } else {
        // Create new user
        const hash = await bcrypt.hash(userData.password, 10);
        await User.create({
          username: userData.username,
          password_hash: hash,
          role: userData.role
        });
        console.log(`✅ User "${userData.username}" created successfully!`);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 USER CREDENTIALS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 ADMIN (Full Access - CRUD):');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Access:   Create, Read, Update, Delete semua data');
    console.log('');
    console.log('👤 USER (Read-Only):');
    console.log('   Username: user');
    console.log('   Password: user123');
    console.log('   Access:   Hanya melihat data (Read-Only)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Change default passwords in production!');
    console.log('✅ Setup complete!\n');
    
  } catch (error) {
    console.error('❌ Error creating users:', error.message);
    if (error.parent) {
      console.error('   Details:', error.parent.message);
    }
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

createUsers();

