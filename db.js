const { Pool } = require('pg');

// Ganti sesuai dengan koneksi PostgreSQL kamu
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'coba',
  password: 'postgres',  // ganti ini!
  port: 5432,                 // port default PostgreSQL
});

module.exports = pool;
