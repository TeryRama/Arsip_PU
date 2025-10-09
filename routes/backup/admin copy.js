const express = require('express');
const router = express.Router();
const pool = require('../../db');
const { isAdmin } = require('../../middleware/auth');
const { cekLogin } = require('../../middleware/auth');

// Middleware cek login
// function cekLogin(req, res, next) {
//   if (!req.session.user) {
//     return res.redirect('/login');
//   }
//   next();
// }

// Terapkan middleware untuk semua route di bawah
router.use(cekLogin);
// router.use(isAdmin);

// Halaman dashboard admin
router.get('/admin',isAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM surat_masuk WHERE deleted_at IS NULL ORDER BY id DESC');
    res.render('admin', {
      user: req.session.user,
      suratList: result.rows
    });
  } catch (err) {
    console.error('Gagal mengambil data surat:', err);
    res.status(500).send('Terjadi kesalahan.');
  }
});

// Logout (jika kamu ingin logout tetap bisa diakses siapa saja, pindahkan ke file auth.js)
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
