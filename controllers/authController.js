const bcrypt = require('bcrypt');
const { generateToken, addToken } = require('../middleware/authMiddleware');
const db = require('../models');
const User = db.User;

// REGISTER USER BARU
exports.register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username dan password wajib diisi',
        });
    }

    try {
        // Cek apakah username sudah ada
        const exists = await User.findOne({ where: { username } });
        if (exists) {
            return res.status(409).json({
                success: false,
                message: 'Username sudah dipakai',
            });
        }

        const hash = await bcrypt.hash(password, 10);
        await User.create({ username, password_hash: hash, role: 'user' });

        return res.status(201).json({
            success: true,
            message: 'User berhasil terdaftar',
            user: { username, role: 'user' },
        });
    } catch (error) {
        console.error('Error register:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat register',
        });
    }
};

// LOGIN USER
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username dan password wajib diisi',
        });
    }

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah',
            });
        }

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({
                success: false,
                message: 'Username atau password salah',
            });
        }

        const token = generateToken();
        addToken(token, { id: user.id, username: user.username, role: user.role });

        return res.json({
            success: true,
            message: 'Login berhasil. Gunakan token pada header Authorization: Bearer <token>',
            token,
            user: { id: user.id, username: user.username, role: user.role },
        });
    } catch (error) {
        console.error('Error login:', error);
        console.error('Error details:', error.message);
        if (error.parent) {
            console.error('Database error:', error.parent.message);
        }
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

