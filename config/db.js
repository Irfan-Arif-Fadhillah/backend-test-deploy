const { Pool } = require('pg');

// Konfigurasi Pool PostgreSQL
const pool = new Pool({
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres123',
    database: process.env.PGDATABASE || 'dasar_backend_dev',
    max: 10,
    idleTimeoutMillis: 30000,
});

module.exports = pool;

