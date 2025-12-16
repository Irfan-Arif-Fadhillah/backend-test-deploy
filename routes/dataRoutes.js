// ROUTER: Peta arah / pengatur jalur
const express = require('express');
const router = express.Router();

// Panggil controller yang barusan dibuat
const controller = require('../controllers/dataController');
const { checkAuth, checkAdmin } = require('../middleware/authMiddleware');

// Proteksi semua endpoint dengan token
router.use(checkAuth);

// ROUTES CRUD:
// GET    /api/data        -> Ambil semua data
// GET    /api/data/:id    -> Ambil data berdasarkan ID
// POST   /api/data        -> Buat data baru
// PUT    /api/data/:id    -> Update data berdasarkan ID
// DELETE /api/data/:id    -> Hapus data berdasarkan ID

router.get('/', controller.getAllData);           // GET all
router.get('/:id', controller.getDataById);       // GET by ID
router.post('/', checkAdmin, controller.createData);         // CREATE (admin)
router.put('/:id', checkAdmin, controller.updateData);        // UPDATE (admin)
router.delete('/:id', checkAdmin, controller.deleteData);     // DELETE (admin)

module.exports = router;