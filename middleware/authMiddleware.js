const crypto = require('crypto');

// Simpan token + payload user di memory (untuk belajar; production pakai DB/Redis/JWT)
const tokens = new Map(); // token -> { id, username, role }

// Generate token acak
const generateToken = () => crypto.randomBytes(24).toString('hex');

// Simpan token baru beserta payload user
const addToken = (token, payload) => tokens.set(token, payload);

// Middleware pengecekan auth
const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak ditemukan. Gunakan header Authorization: Bearer <token>'
        });
    }

    const user = tokens.get(token);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Token tidak valid atau sudah kadaluarsa (simulasi).'
        });
    }

    req.user = user; // { id, username, role }
    next();
};

// Middleware cek role admin
const checkAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Akses khusus admin.'
        });
    }
    next();
};

// Export functions
module.exports.generateToken = generateToken;
module.exports.addToken = addToken;
module.exports.checkAuth = checkAuth;
module.exports.checkAdmin = checkAdmin;
