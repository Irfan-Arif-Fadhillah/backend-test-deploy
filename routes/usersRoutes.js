const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { checkAuth, checkAdmin } = require('../middleware/authMiddleware');

// Proteksi semua endpoint dengan token
router.use(checkAuth);

// ROUTES CRUD USERS:
// GET    /api/users        -> Ambil semua users (admin: semua, user: hanya dirinya)
// GET    /api/users/:id     -> Ambil user berdasarkan ID (admin: semua, user: hanya dirinya)
// POST   /api/users        -> Buat user baru (admin only)
// PUT    /api/users/:id    -> Update user (admin only)
// DELETE /api/users/:id    -> Hapus user (admin only)

router.get('/', usersController.getAllUsers);           // GET all (role-based)
router.get('/:id', usersController.getUserById);         // GET by ID (role-based)
router.post('/', checkAdmin, usersController.createUser);         // CREATE (admin only)
router.put('/:id', checkAdmin, usersController.updateUser);       // UPDATE (admin only)
router.delete('/:id', checkAdmin, usersController.deleteUser);   // DELETE (admin only)

module.exports = router;

