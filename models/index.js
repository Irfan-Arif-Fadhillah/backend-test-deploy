const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.PGDATABASE || 'dasar_backend_dev',
    process.env.PGUSER || 'postgres',
    process.env.PGPASSWORD || 'postgres123',
    {
        host: process.env.PGHOST || 'localhost',
        port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
        dialect: 'postgres',
        logging: false,
    }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Models
db.User = require('./user')(sequelize);

module.exports = db;

