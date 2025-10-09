// routes/notifications.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const fs = require('fs');
const path = require('path');

// ✅ GET data notifikasi untuk user login (AJAX dropdown)
router.get('/data', async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const result = await pool.query(
      `SELECT n.id, n.message, n.is_read, n.created_at, n.surat_id, s.nama_file
       FROM notifications n
       LEFT JOIN surat_masuk s ON s.id = n.surat_id
       WHERE n.user_id = $1
       ORDER BY n.created_at DESC
       LIMIT 20`,
      [userId]
    );

    const rows = result.rows;
    const unreadCount = rows.filter(r => !r.is_read).length;

    // tambahkan url: kalau file ada → ke file, kalau tidak → ke detail surat, kalau surat pun tidak ada → ke 404
    const notifications = rows.map(r => {
      let url = null;
      if (r.nama_file) {
        const filePath = path.join(__dirname, '..', 'uploads', r.nama_file);
        if (fs.existsSync(filePath)) {
          url = `/uploads/${r.nama_file}`;
        } else if (r.surat_id) {
          url = `/surat/detail/${r.surat_id}`;
        } else {
          url = '/errors/404';
        }
      } else if (r.surat_id) {
        url = `/surat/detail/${r.surat_id}`;
      } else {
        url = '/errors/404';
      }
      return { ...r, url };
    });

    res.json({ unreadCount, notifications });
  } catch (err) {
    console.error('Notif error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Tandai 1 notif sudah dibaca
router.post('/mark-read/:id', async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    await pool.query(
      `UPDATE notifications 
       SET is_read = TRUE, read_at = NOW()
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Tandai semua notif user sudah dibaca
router.post('/mark-all-read', async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    await pool.query(
      `UPDATE notifications 
       SET is_read = TRUE, read_at = NOW()
       WHERE user_id = $1`,
      [userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Mark all read error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Halaman list semua notifikasi
router.get('/', async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.redirect('/login');

    const result = await pool.query(
      `SELECT n.id, n.message, n.is_read, n.created_at, n.surat_id, s.nama_file
       FROM notifications n
       LEFT JOIN surat_masuk s ON s.id = n.surat_id
       WHERE n.user_id = $1
       ORDER BY n.created_at DESC`,
      [userId]
    );

    const notifications = result.rows.map(r => {
      let url = null;
      if (r.nama_file) {
        const filePath = path.join(__dirname, '..', 'uploads', r.nama_file);
        if (fs.existsSync(filePath)) {
          url = `/uploads/${r.nama_file}`;
        } else if (r.surat_id) {
          url = `/surat/detail/${r.surat_id}`;
        } else {
          url = '/errors/404';
        }
      } else if (r.surat_id) {
        url = `/surat/detail/${r.surat_id}`;
      } else {
        url = '/errors/404';
      }
      return { ...r, url };
    });

    const layoutFile =
      req.session.user.role === 'admin' ? 'layouts/admin' : 'layouts/user';

    res.render('notifications/index', {
      title: 'Notifikasi',
      user: req.session.user,
      notifications,
      activePage: 'notifications',
      layout: layoutFile
    });
  } catch (err) {
    console.error('Notif page error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
