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


    // Konfigurasi penyimpanan file PDF
    const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        const filename = Date.now() + '-' + file.originalname;
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
            (nomor_surat, hal, dari, tanggal_surat, tanggal_diterima, catatan, nama_file) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
        nomor_surat,
        hal,
        dari,
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



    // Halaman user
    app.get('/user', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM surat_masuk ORDER BY id DESC');
        res.render('user', { suratList: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Gagal mengambil data dari database.');
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
  const { nomor_surat, hal, dari, tanggal_surat, tanggal_diterima, catatan } = req.body;
  try {
    await pool.query(`
      UPDATE surat_masuk SET 
        nomor_surat = $1, hal = $2, dari = $3, 
        tanggal_surat = $4, tanggal_diterima = $5, catatan = $6 
      WHERE id = $7
    `, [nomor_surat, hal, dari, tanggal_surat, tanggal_diterima, catatan, req.params.id]);
    res.redirect('/user');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal mengupdate data');
  }
});


// Hapus surat masuk
app.post('/delete/:id', async (req, res) => {
  try {
    // ambil nama file sebelum hapus data
    const result = await pool.query('SELECT nama_file FROM surat_masuk WHERE id = $1', [req.params.id]);
    const namaFile = result.rows[0]?.nama_file;

    await pool.query('DELETE FROM surat_masuk WHERE id = $1', [req.params.id]);

    // hapus file fisik juga
    if (namaFile) {
      const filePath = path.join(__dirname, 'uploads', namaFile);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.redirect('/user');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menghapus data');
  }
});



    app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    });
