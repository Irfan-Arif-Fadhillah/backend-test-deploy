const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { checkAuth, checkAdmin } = require('../middleware/authMiddleware');

// Apply authentication to all routes
router.use(checkAuth);

// ROUTES STATISTIK:
// GET    /api/stats/users         -> Statistik pengguna (admin only)

router.get('/users', checkAdmin, statsController.getUserStats);     // Statistik pengguna (admin only)

module.exports = router;
