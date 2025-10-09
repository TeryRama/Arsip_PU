const express = require('express');
const router = express.Router();
const pool = require('../../db');
const bcrypt = require('bcrypt');

// Login
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).send('Username dan password wajib diisi.');

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      // Username salah → kosongkan input
      return res.render('login', { error: 'Username atau password salah.', usernamePrefill: '' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      // Password salah → isi kembali username
      return res.render('login', { error: 'Username atau password salah.', usernamePrefill: username });
    }

    // Simpan sesi login
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    if (user.role === 'admin') {
      res.redirect('/admin');
    } else {
      res.redirect('/user');
    }
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Terjadi kesalahan saat login.', usernamePrefill: '' });
  }
});



// Register
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

// Ubah password
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

router.put('/reset-password', async (req, res) => {
  const { username,  newPassword } = req.body;

  if (!username || !newPassword) {
    return res.status(400).send('Username dan password baru wajib diisi.');
  }

  try {
    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1 ',
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

module.exports = router;
