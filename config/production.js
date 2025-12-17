module.exports = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres123',
    database: process.env.DB_NAME || 'dasar_backend_prod',
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false // Hati-hati dengan ini di production
      } : false
    }
  },
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_here',
  port: process.env.PORT || 3001
};
