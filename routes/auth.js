const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// ===================== LOGIN =====================
router.get('/login', (req, res) => {
  // Jika sudah login, redirect ke dashboard sesuai role
  if (req.session.user) {
    return req.session.user.role === 'admin'
      ? res.redirect('/admin')
      : res.redirect('/user');
  }

  res.render('login', { 
    layout: false,       // ⬅️ login tanpa layout
    error: null,
    usernamePrefill: ''
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('login', { 
      layout: false,
      error: 'Username dan password wajib diisi.',
      usernamePrefill: username
    });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.render('login', { 
        layout: false,
        error: 'Username atau password salah.',
        usernamePrefill: ''
      });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.render('login', { 
        layout: false,
        error: 'Username atau password salah.',
        usernamePrefill: username
      });
    }

    // Simpan sesi login
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      nama_lengkap: user.nama_lengkap,
    };

    // Arahkan sesuai role
    if (user.role === 'admin') {
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/user/dashboard');
    }

  } catch (err) {
    console.error(err);
    res.render('login', { 
      layout: false,
      error: 'Terjadi kesalahan saat login.',
      usernamePrefill: username
    });
  }
});

// ===================== REGISTER =====================
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
      [username, hashedPassword, role || 'user']
    );
    res.status(201).json({ message: 'Akun berhasil didaftarkan.' });
  } catch (err) {
    console.error('Gagal mendaftarkan akun:', err);
    if (err.code === '23505') {
      res.status(400).json({ message: 'Username sudah digunakan.' });
    } else {
      res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
  }
});

// ===================== UBAH PASSWORD =====================
router.post('/ubah-password', async (req, res) => {
  const user = req.session.user;
  const { password_lama, password_baru, konfirmasi_password } = req.body;

  if (!user) return res.status(401).send('Anda belum login.');
  if (!password_lama || !password_baru || !konfirmasi_password)
    return res.status(400).send('Semua kolom wajib diisi.');
  if (password_baru !== konfirmasi_password)
    return res.status(400).send('Konfirmasi password tidak cocok.');

  try {
    const result = await pool.query('SELECT password FROM users WHERE id = $1', [user.id]);

    if (result.rows.length === 0)
      return res.status(404).send('User tidak ditemukan.');

    const passwordBenar = await bcrypt.compare(password_lama, result.rows[0].password);
    if (!passwordBenar)
      return res.status(403).send('Password lama salah.');

    const hashedBaru = await bcrypt.hash(password_baru, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedBaru, user.id]);

    res.send('Password berhasil diubah.');
  } catch (err) {
    console.error('Gagal ubah password:', err);
    res.status(500).send('Terjadi kesalahan server.');
  }
});

// ===================== RESET PASSWORD =====================
router.put('/reset-password', async (req, res) => {
  const { username, newPassword } = req.body;

  if (!username || !newPassword) {
    return res.status(400).send('Username dan password baru wajib diisi.');
  }

  try {
    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).send('User tidak ditemukan.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [
      hashedPassword,
      userResult.rows[0].id,
    ]);

    res.send('Password berhasil direset.');
  } catch (err) {
    console.error('Gagal reset password:', err);
    res.status(500).send('Terjadi kesalahan server.');
  }
});

// ===================== LOGOUT =====================
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Gagal logout:', err);
      return res.redirect('/');
    }

    res.clearCookie('connect.sid'); // hapus cookie session
    res.redirect('/login?logout=1'); // kirim query ke login page
  });
});

module.exports = router;
