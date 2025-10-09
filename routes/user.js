const express = require('express');
const router = express.Router();
const pool = require('../db');

// ===================== Middleware cek login & role user =====================
function ensureUser(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  if (req.session.user.role !== 'user') return res.status(403).send('Akses ditolak');
  next();
}

// ===================== DASHBOARD USER =====================
// router.get('/user/dashboard', ensureUser, async (req, res) => {
//   try {
//     const masuk = await pool.query(`SELECT COUNT(*) AS total FROM surat_masuk WHERE jenis_surat='Masuk' AND deleted_at IS NULL`);
//     const keluar = await pool.query(`SELECT COUNT(*) AS total FROM surat_masuk WHERE jenis_surat='Keluar' AND deleted_at IS NULL`);

//     res.render('user/dashboard', {
//       layout: 'layouts/user',
//       title: 'Dashboard User',
//       activePage: 'dashboard',
//       user: req.session.user,
//       totalMasuk: parseInt(masuk.rows[0].total, 10),
//       totalKeluar: parseInt(keluar.rows[0].total, 10)
//     });
//   } catch (err) {
//     console.error('Gagal load dashboard:', err);
//     res.status(500).send('Terjadi kesalahan.');
//   }
// });

// ===================== DASHBOARD =====================
router.get('/user/dashboard', ensureUser, async (req, res) => {
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

    // res.render('user/dashboard2', {
    //   title: 'Dashboard Surat',
    //   user: req.session.user,
    //   totalMasuk,
    //   totalKeluar,
    //   chartData: JSON.stringify({ masuk: masukData, keluar: keluarData }),
    //   layout: req.session.user.role === 'admin' ? 'layouts/admin' : 'layouts/user',
    //   activePage: 'dashboard'
    // });
    res.render('user/dashboard2', {
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


// ===================== PROFIL USER =====================
router.get('/user/profile', ensureUser, (req, res) => {
  res.render('user/profile', {
    layout: 'layouts/user',   // ✅ pakai layout user
    title: 'Profil Saya',
    user: req.session.user,
    activePage: 'profile'
  });
});

module.exports = router;
