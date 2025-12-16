const db = require('../models');
const User = db.User;

exports.getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const adminCount = await User.count({ where: { role: 'admin' } });
        const userCount = await User.count({ where: { role: 'user' } });

        res.json({
            success: true,
            data: {
                totalUsers,
                adminCount,
                userCount
            }
        });
    } catch (error) {
        console.error('Error getting user stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user statistics'
        });
    }
};
