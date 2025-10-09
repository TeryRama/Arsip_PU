const express = require('express');
const router = express.Router();
const pool = require('../db');
const { cekLogin, isAdmin } = require('../middleware/auth');
const bcrypt = require('bcrypt');

// ===================== Semua route admin harus login =====================
router.use(cekLogin);

// ===================== DASHBOARD ADMIN =====================
// router.get('/admin', isAdmin, async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT * FROM surat_masuk WHERE deleted_at IS NULL ORDER BY id DESC'
//     );

//     res.render('admin/index', {
//       layout: 'layouts/admin',   // ✅ gunakan layout admin
//       title: 'Dashboard Admin',
//       activePage: 'admin',
//       user: req.session.user,
//       suratList: result.rows
//     });
//   } catch (err) {
//     console.error('Gagal mengambil data surat:', err);
//     res.status(500).send('Terjadi kesalahan.');
//   }
// });

router.get('/admin/dashboard', isAdmin, async (req, res) => {
   try {
    // total surat masuk
    const totalMasukResult = await pool.query(
      `SELECT COUNT(*) AS total 
       FROM surat_masuk 
       WHERE jenis_surat = 'Masuk' AND deleted_at IS NULL`
    );
    const totalMasuk = parseInt(totalMasukResult.rows[0].total, 10);

    // total surat keluar
    const totalKeluarResult = await pool.query(
      `SELECT COUNT(*) AS total 
       FROM surat_masuk 
       WHERE jenis_surat = 'Keluar' AND deleted_at IS NULL`
    );
    const totalKeluar = parseInt(totalKeluarResult.rows[0].total, 10);

    // statistik per bulan (masuk)
    const statistikMasuk = await pool.query(
      `SELECT TO_CHAR(tanggal_surat, 'YYYY-MM') AS bulan, COUNT(*) AS total
       FROM surat_masuk
       WHERE jenis_surat = 'Masuk' AND deleted_at IS NULL
       GROUP BY bulan
       ORDER BY bulan ASC`
    );

    // statistik per bulan (keluar)
    const statistikKeluar = await pool.query(
      `SELECT TO_CHAR(tanggal_surat, 'YYYY-MM') AS bulan, COUNT(*) AS total
       FROM surat_masuk
       WHERE jenis_surat = 'Keluar' AND deleted_at IS NULL
       GROUP BY bulan
       ORDER BY bulan ASC`
    );

    // mapping ke JSON untuk chart
    const masukData = statistikMasuk.rows.map(r => ({ bulan: r.bulan, total: r.total }));
    const keluarData = statistikKeluar.rows.map(r => ({ bulan: r.bulan, total: r.total }));
    
    res.render('admin/dashboard2', {
      title: 'Dashboard Surat',
      user: req.session.user,
      totalMasuk,
      totalKeluar,
      chartData: { masuk: masukData, keluar: keluarData }, // kirim object biasa
      layout: req.session.user.role === 'admin' ? 'layouts/admin' : 'layouts/user',
      activePage: 'dashboard'
    });


  } catch (err) {
    console.error("Gagal ambil dashboard:", err);
    res.status(500).send('Terjadi kesalahan server.');
  }
});

// Halaman dashboard admin (opsional, alias dari /admin)
// router.get('/admin/dashboard', isAdmin, (req, res) => {
//   res.render('admin/dashboard', {
//     layout: 'layouts/admin',   // ✅ gunakan layout admin
//     title: 'Dashboard Admin',
//     activePage: 'dashboard',
//     user: req.session.user
//   });
// });

// ===================== LOGOUT =====================
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// ===================== MANAJEMEN USER =====================
// List user
router.get('/admin/users', isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE deleted_at IS NULL ORDER BY id DESC'
    );
    res.render('admin/users/index', {
      layout: 'layouts/admin',   // ✅ gunakan layout admin
      title: 'Manajemen User',
      activePage: 'users',
      user: req.session.user,
      userList: result.rows
    });
  } catch (err) {
    console.error('Gagal ambil user:', err);
    res.status(500).send('Terjadi kesalahan.');
  }
});

// Form tambah user
router.get('/admin/users/add', isAdmin, (req, res) => {
  res.render('admin/users/add', {
    layout: 'layouts/admin',   // ✅ gunakan layout admin
    title: 'Tambah User',
    activePage: 'users',
    user: req.session.user
  });
});

// ===================== PROSES TAMBAH USER =====================
router.post('/admin/users/add', isAdmin, async (req, res) => {
  const { nama_lengkap, username, email, password, role, is_email_notif_enabled } = req.body;

  if (!nama_lengkap || !username || !password) {
    return res.status(400).send('Nama lengkap, username, dan password wajib diisi.');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
          `INSERT INTO users (nama_lengkap, username, email, password, role, is_email_notif_enabled, created_at, updated_at) 
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
          [
            nama_lengkap,
            username,
            email || null,
            hashedPassword,
            role || 'user',
            is_email_notif_enabled === 'on'
          ]
        );

    res.redirect('/admin/users');
  } catch (err) {
    console.error('Gagal tambah user:', err);
    res.status(500).send('Terjadi kesalahan saat menambahkan user.');
  }
});

module.exports = router;
