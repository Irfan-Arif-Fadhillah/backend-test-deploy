const bcrypt = require('bcrypt');
const db = require('../models');
const User = db.User;

// GET ALL USERS - Admin dan User bisa lihat semua (tapi hanya admin yang bisa CRUD)
exports.getAllUsers = async (req, res) => {
    try {
        // Baik admin maupun user biasa bisa melihat semua users
        // Perbedaan hanya di frontend: admin punya tombol CRUD, user hanya read-only
        const users = await User.findAll({
            attributes: ['id', 'username', 'role', 'created_at'],
            order: [['created_at', 'DESC']]
        });

        return res.json({
            success: true,
            message: 'Data users berhasil diambil',
            data: users,
            total: users.length
        });
    } catch (error) {
        console.error('Error getAllUsers:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat mengambil data users'
        });
    }
};

// GET USER BY ID - Admin bisa lihat semua, User hanya bisa lihat dirinya sendiri
exports.getUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        // User biasa hanya bisa akses data sendiri
        if (req.user.role !== 'admin' && req.user.id !== id) {
            return res.status(403).json({
                success: false,
                message: 'Anda tidak memiliki akses untuk melihat data user ini'
            });
        }

        const user = await User.findByPk(id, {
            attributes: ['id', 'username', 'role', 'created_at']
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan',
                data: null
            });
        }

        return res.json({
            success: true,
            message: 'User ditemukan',
            data: user
        });
    } catch (error) {
        console.error('Error getUserById:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat mengambil data user'
        });
    }
};

// CREATE USER - Hanya Admin
exports.createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username dan password wajib diisi'
            });
        }

        // Validasi role
        const validRole = role && (role === 'admin' || role === 'user') ? role : 'user';

        // Cek apakah username sudah ada
        const exists = await User.findOne({ where: { username } });
        if (exists) {
            return res.status(409).json({
                success: false,
                message: 'Username sudah dipakai'
            });
        }

        const hash = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            password_hash: hash,
            role: validRole
        });

        return res.status(201).json({
            success: true,
            message: 'User berhasil dibuat',
            data: {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role,
                created_at: newUser.created_at
            }
        });
    } catch (error) {
        console.error('Error createUser:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat membuat user'
        });
    }
};

// UPDATE USER - Hanya Admin
exports.updateUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { username, password, role } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        // Update username jika ada
        if (username && username !== user.username) {
            const exists = await User.findOne({ where: { username } });
            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: 'Username sudah dipakai'
                });
            }
            user.username = username;
        }

        // Update password jika ada
        if (password) {
            user.password_hash = await bcrypt.hash(password, 10);
        }

        // Update role jika ada (hanya admin bisa ubah role)
        if (role && (role === 'admin' || role === 'user')) {
            user.role = role;
        }

        await user.save();

        return res.json({
            success: true,
            message: 'User berhasil diupdate',
            data: {
                id: user.id,
                username: user.username,
                role: user.role,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('Error updateUser:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat mengupdate user'
        });
    }
};

// DELETE USER - Hanya Admin
exports.deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Admin tidak bisa hapus dirinya sendiri
        if (req.user.id === id) {
            return res.status(400).json({
                success: false,
                message: 'Admin tidak bisa menghapus akun sendiri'
            });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        await user.destroy();

        return res.json({
            success: true,
            message: 'User berhasil dihapus',
            data: {
                id: user.id,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Error deleteUser:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat menghapus user'
        });
    }
};

