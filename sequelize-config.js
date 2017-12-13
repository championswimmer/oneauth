var secrets = require('./secrets-sample');

module.exports = {
  database: process.env.DB_NAME || 'oneauth',
  username: secrets.DB.USER,
  password: secrets.DB.PASSWORD,
  dialect: 'postgres',
  // dialectModulePath: 'pg.js'
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  pool: {
      max: 5,
      min: 0,
      idle: 10000
  }
};
