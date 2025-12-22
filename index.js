require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const app = express();

// Import routers
const dataRoutes = require('./routes/dataRoutes');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const statsRoutes = require('./routes/statsRoutes');

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'https://dasar-backend-frontend.vercel.app',
      'https://dasar-backend-git-main-yourusername.vercel.app'
    ];

    // In development, allow localhost and 127.0.0.1
    // In production, only allow specified domains
    if (process.env.NODE_ENV === 'development' || !origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/stats', statsRoutes);

// Serve static files from the React app
app.use(express.static('frontend/.next/static', { index: false }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

// Database sync function
const syncDatabase = async () => {
  try {
    console.log('🔌 Attempting to connect to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Running database migrations...');
      try {
        // Run migrations
        await sequelize.sync({ alter: true });
        console.log('✅ Database synchronized successfully.');
      } catch (syncError) {
        console.warn('⚠️  Warning: Database sync with alter failed, trying without alter...');
        console.warn('   This is normal if tables already exist with different structure.');
        await sequelize.sync();
      }
    } else {
      console.log('🔧 Development mode: Using auto-sync');
      await sequelize.sync({ alter: true });
    }
  } catch (error) {
    console.error('❌ Database connection/sync failed:', error.message);
    console.error('   Error details:', error.original ? error.original : 'No additional details');
    process.exit(1);
  }
};

// Start the server
const startServer = () => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

// Initialize and start the application
const initializeApp = async () => {
  try {
    await syncDatabase();
    startServer();
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
};

initializeApp();
