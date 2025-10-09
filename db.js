const { Pool } = require('pg');

// Koneksi ke databse
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'coba',
  password: 'postgres',  
  port: 5432,              
});

module.exports = pool;
