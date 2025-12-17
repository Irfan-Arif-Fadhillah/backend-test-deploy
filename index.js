require('dotenv').config();
const express = require('express');
const db = require('./models');
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Import routers
const dataRoutes = require('./routes/dataRoutes');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const statsRoutes = require('./routes/statsRoutes');

// CORS middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'https://dasar-backend-frontend.vercel.app', // Ganti dengan URL Vercel Anda
        'https://dasar-backend-git-main-yourusername.vercel.app' // Format URL Vercel preview
    ];
    
    // Di development, izinkan origin yang ada di allowedOrigins
    // Di production, izinkan semua origin untuk sementara (bisa disesuaikan nanti)
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
    } else if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

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
