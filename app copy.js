    const pool = require('./db');
    const express = require('express');
    const multer = require('multer');
    const path = require('path');
    const fs = require('fs');

    const app = express();
    app.use(express.urlencoded({ extended: true }));
    const PORT = 3000;

    app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.send(`Koneksi berhasil! Waktu server DB: ${result.rows[0].now}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Gagal konek ke database.');
    }
    });
function authMiddleware(req, res, next) {
  if (req.session.user) {
    return next();
  }
  return res.redirect('/login');
}

// Pakai sebelum /admin
app.get('/admin', authMiddleware, async (req, res) => {
  // kode admin Anda
});


    // Konfigurasi penyimpanan file PDF
    // const storage = multer.diskStorage({
    // destination: './uploads/',
    // filename: (req, file, cb) => {
    //     const filename = Date.now() + '-' + file.originalname;
    //     cb(null, filename);
    // }
    // });

    const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        const now = new Date();

        const pad = (n) => n.toString().padStart(2, '0');

        const year = now.getFullYear();
        const month = pad(now.getMonth() + 1);
        const date = pad(now.getDate());
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());
        const seconds = pad(now.getSeconds());

        const timestamp = `${year}${month}${date}_${hours}${minutes}${seconds}`;
        const originalName = file.originalname.replace(/\s+/g, '-'); // ganti spasi dengan tanda minus

        const filename = `${timestamp}_${originalName}`;
        cb(null, filename);
    }
    });


    const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Filter hanya PDF
        if (file.mimetype === 'application/pdf') {
        cb(null, true);
        } else {
        cb(new Error('Hanya file PDF yang diperbolehkan!'));
        }
    }
    });

    app.set('view engine', 'ejs');
    app.use(express.static('uploads')); // agar PDF bisa diakses

    // Halaman upload (admin)
    app.get('/admin', (req, res) => {
    res.render('admin');
    });

    // Proses upload + simpan ke database
    app.post('/upload', upload.single('pdf'), async (req, res) => {
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const {
        nomor_surat,
        hal,
        dari,
        ditujukan_kepada,
        tanggal_surat,
        tanggal_diterima,
        catatan
    } = req.body;

    const nama_file = req.file?.filename;

    if (!nama_file) {
        return res.status(400).send('❌ File tidak ditemukan dalam request.');
    }

    try {
        await pool.query(`
        INSERT INTO surat_masuk 
            (nomor_surat, hal, dari,ditujukan_kepada, tanggal_surat, tanggal_diterima, catatan, nama_file) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
        nomor_surat,
        hal,
        dari,
        ditujukan_kepada,
        tanggal_surat,
        tanggal_diterima,
        catatan || null,
        nama_file
        ]);

        res.status(200).json({ message: 'Berhasil' });

    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).send('❌ Gagal menyimpan ke database.');
    }
    });


app.get('/user', async (req, res) => {
  const { q, ditujukan_kepada, sort_by, order } = req.query;

  let query = 'SELECT * FROM surat_masuk WHERE deleted_at IS NULL';
  let params = [];
  let count = 1;

  if (q) {
    query += ` AND (nomor_surat ILIKE $${count} OR hal ILIKE $${count} OR dari ILIKE $${count} OR ditujukan_kepada ILIKE $${count})`;
    params.push(`%${q}%`);
    count++;
  }

  if (ditujukan_kepada && ditujukan_kepada !== 'Semua') {
    query += ` AND ditujukan_kepada = $${count}`;
    params.push(ditujukan_kepada);
    count++;
  }

  // Validasi sort_by dan order untuk keamanan
  const validColumns = ['nomor_surat', 'hal', 'dari', 'ditujukan_kepada', 'tanggal_surat', 'tanggal_diterima'];
  const sortColumn = validColumns.includes(sort_by) ? sort_by : 'created_at';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

  query += ` ORDER BY ${sortColumn} ${sortOrder}`;

  try {
    const result = await pool.query(query, params);
    res.render('user', {
      suratList: result.rows,
      searchQuery: q || '',
      filterditujukan_kepada: ditujukan_kepada || '',
      sortBy: sort_by || '',
      sortOrder: order || ''
    });
  } catch (err) {
    console.error('Gagal mengambil data surat:', err);
    res.status(500).send('Terjadi kesalahan saat mengambil data.');
  }
});

// Tampilkan form edit
app.get('/edit/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM surat_masuk WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.send('Data tidak ditemukan');
    res.render('edit', { surat: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal mengambil data');
  }
});

// Proses update data
app.post('/edit/:id', async (req, res) => {
  const {
    nomor_surat,
    hal,
    dari,
    tanggal_surat,
    tanggal_diterima,
    catatan,
    ditujukan_kepada
  } = req.body;

  try {
    await pool.query(`
      UPDATE surat_masuk SET 
        nomor_surat = $1, hal = $2, dari = $3, 
        tanggal_surat = $4, tanggal_diterima = $5, 
        catatan = $6, ditujukan_kepada = $7
      WHERE id = $8
    `, [
      nomor_surat,
      hal,
      dari,
      tanggal_surat,
      tanggal_diterima,
      catatan || null,
      ditujukan_kepada || null,
      req.params.id
    ]);

    res.status(200).json({ message: 'Berhasil update' });
  } catch (err) {
    console.error('Edit Error:', err);
    res.status(500).send('Gagal update data');
  }
});



// Hapus surat masuk
app.post('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      'UPDATE surat_masuk SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
    res.status(200).json({ message: 'Berhasil dihapus' });
  } catch (err) {
    console.error('Gagal soft delete:', err);
    res.status(500).json({ message: 'Gagal menghapus data' });
  }
});

app.get('/arsip', async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM surat_masuk WHERE deleted_at IS NOT NULL ORDER BY id DESC");
    res.render('arsip', { suratList: rows }); // ✅ Kirim variabel suratList ke EJS
  } catch (err) {
    console.error('Gagal mengambil data arsip:', err);
    res.status(500).send('Terjadi kesalahan');
  }
});


app.post('/restore/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE surat_masuk SET deleted_at = NULL WHERE id = $1', [id]);
    res.redirect('/arsip');
  } catch (err) {
    console.error('Gagal memulihkan data:', err);
    res.status(500).send('Gagal memulihkan surat.');
  }
});

// const fs = require('fs');
// const path = require('path');

app.post('/delete-permanent/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT nama_file FROM surat_masuk WHERE id = $1', [id]);

    if (rows.length > 0) {
      const filename = rows[0].nama_file;
      const filepath = path.join(__dirname, 'uploads', filename);

      // Hapus file dari server
      fs.unlink(filepath, (err) => {
        if (err) console.warn('File tidak ditemukan atau gagal dihapus:', err.message);
      });

      // Hapus dari database
      await pool.query('DELETE FROM surat_masuk WHERE id = $1', [id]);

      res.status(200).send('Berhasil dihapus permanen');
    } else {
      res.status(404).send('Data tidak ditemukan');
    }
  } catch (err) {
    console.error('Gagal menghapus permanen:', err);
    res.status(500).send('Gagal menghapus data permanen');
  }
});

const session = require('express-session');
app.use(session({
  secret: 'arsipSuratSecret',
  resave: false,
  saveUninitialized: true
}));

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Ganti dengan pengecekan dari database
  if (username === 'admin' && password === '12345') {
    req.session.user = { username };
    return res.redirect('/admin');
  } else {
    return res.render('login', { error: 'Username atau password salah.' });
  }
});


const bcrypt = require('bcrypt');

// API untuk mendaftarkan akun baru
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi.' });
  }

  try {
    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
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


    app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    });
