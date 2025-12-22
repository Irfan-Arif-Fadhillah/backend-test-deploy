require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Import routers
const dataRoutes = require('./routes/dataRoutes');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Konfigurasi CORS
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

    // Di development, izinkan localhost dan 127.0.0.1
    // Di production, hanya izinkan domain yang sudah ditentukan
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

// Gunakan CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/stats', statsRoutes);

// Serve static files from the React app
app.use(express.static('frontend/.next/static', { index: false }));

// Start server after syncing with the database
db.sequelize.authenticate()
    .then(() => {
        console.log('Database connection successful.');
        return db.sequelize.sync({ alter: false });
    })
    .then(() => {
        console.log('Database synced successfully.');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        if (err.message && err.message.includes('permission denied')) {
            console.warn('⚠️  Warning: Database permission denied. Assuming tables already exist.');
            console.warn('   Starting server anyway. Make sure the database tables are properly set up.');
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        } else {
            console.error('❌ Database connection/sync failed:', err.message);
            process.exit(1);
        }
    });
