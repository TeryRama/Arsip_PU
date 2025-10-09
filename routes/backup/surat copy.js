// routes/surat.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../../db');
const { cekLogin } = require('../../middleware/auth');

// Konfigurasi penyimpanan file
    // const storage = multer.diskStorage({
    // destination: 'Z:/upload',
    // filename: (req, file, cb) => {
    //     const now = new Date();

    //     const pad = (n) => n.toString().padStart(2, '0');

    //     const year = now.getFullYear();
    //     const month = pad(now.getMonth() + 1);
    //     const date = pad(now.getDate());
    //     const hours = pad(now.getHours());
    //     const minutes = pad(now.getMinutes());
    //     const seconds = pad(now.getSeconds());

    //     const timestamp = `${year}${month}${date}_${hours}${minutes}${seconds}`;
    //     const originalName = file.originalname.replace(/\s+/g, '-'); // ganti spasi dengan tanda minus

    //     const filename = `${timestamp}_${originalName}`;
    //     cb(null, filename);
    // }
    // });
// const upload = multer({ storage });


// Konfigurasi multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Gunakan UNC path, bukan Z: agar tidak tergantung mapping drive
//     const uploadPath = '\\\\pu_dumai\\Arsip\\upload';

//     // Pastikan folder ada, kalau belum buat (opsional)
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }

//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const now = new Date();

//     const pad = (n) => n.toString().padStart(2, '0');

//     const year = now.getFullYear();
//     const month = pad(now.getMonth() + 1);
//     const date = pad(now.getDate());
//     const hours = pad(now.getHours());
//     const minutes = pad(now.getMinutes());
//     const seconds = pad(now.getSeconds());

//     const timestamp = `${year}${month}${date}_${hours}${minutes}${seconds}`;
//     const originalName = file.originalname.replace(/\s+/g, '-'); // ganti spasi jadi minus

//     cb(null, `${timestamp}_${originalName}`);
//   }
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

const upload = multer({ storage: storage });

module.exports = upload;


router.get('/arsip', async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM surat_masuk WHERE deleted_at IS NOT NULL ORDER BY id DESC");
    res.render('arsip', { suratList: rows }); // ✅ Kirim variabel suratList ke EJS
  } catch (err) {
    console.error('Gagal mengambil data arsip:', err);
    res.status(500).send('Terjadi kesalahan');
  }
});

// Tambah surat masuk
router.post('/upload', cekLogin, upload.single('file'), async (req, res) => {
 try {
    const {
      nomor_surat,
      hal,
      dari,
      ditujukan_kepada,
      tanggal_surat,
      tanggal_diterima,
      catatan,
      jenis_surat
    } = req.body;

    const nama_file = req.file ? req.file.filename : null;

    await pool.query(
      `INSERT INTO surat_masuk 
      (nomor_surat, hal, dari, ditujukan_kepada, tanggal_surat, tanggal_diterima, catatan, nama_file, jenis_surat, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())`,
      [
        nomor_surat,
        hal,
        dari,
        ditujukan_kepada,
        tanggal_surat,
        tanggal_diterima,
        catatan,
        nama_file,
        jenis_surat
      ]
    );

    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menyimpan surat');
  }
});

// Hapus surat masuk
router.post('/hapus/:id', cekLogin, async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('UPDATE surat_masuk SET deleted_at = NOW() WHERE id = $1', [id]);
    res.redirect('/admin');
  } catch (err) {
    console.error('Gagal menghapus surat:', err);
    res.status(500).send('Terjadi kesalahan saat menghapus.');
  }
});

// Edit surat masuk
router.post('/edit/:id', cekLogin, upload.single('file'), async (req, res) => {
   const id = req.params.id;
    const {
        nomor_surat,
        hal,
        dari,
        ditujukan_kepada,
        tanggal_surat,
        tanggal_diterima,
        catatan,
        jenis_surat
    } = req.body;

    try {
        // Ambil data lama untuk dapatkan nama file sebelumnya
        const oldData = await pool.query('SELECT nama_file FROM surat_masuk WHERE id = $1', [id]);

        if (oldData.rows.length === 0) {
            return res.status(404).send('Data tidak ditemukan');
        }

        let namaFileBaru = oldData.rows[0].nama_file;

        // Kalau ada file baru diupload
        if (req.file) {
            namaFileBaru = req.file.filename;

            // Hapus file lama dari folder uploads (opsional)
            const fs = require('fs');
            const path = require('path');
            const oldFilePath = path.join(__dirname, 'uploads', oldData.rows[0].nama_file);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        // Update data di database
        await pool.query(
            `UPDATE surat_masuk 
             SET nomor_surat=$1, hal=$2, dari=$3, ditujukan_kepada=$4, 
                 tanggal_surat=$5, tanggal_diterima=$6, catatan=$7, nama_file=$8, 
                 jenis_surat=$9, updated_at=NOW() 
             WHERE id=$10`,
            [
                nomor_surat, hal, dari, ditujukan_kepada,
                tanggal_surat, tanggal_diterima, catatan,
                namaFileBaru, jenis_surat, id
            ]
        );

        res.redirect('/user'); // Kembali ke halaman daftar surat
    } catch (err) {
        console.error(err);
        res.status(500).send('Terjadi kesalahan saat mengedit surat');
    }
});


router.post('/delete-permanent/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query('SELECT nama_file FROM surat_masuk WHERE id = $1', [id]);

    if (rows.length > 0) {
      const filename = rows[0].nama_file;
      // const filepath = path.join(__dirname, 'uploads', filename);
      const filepath = path.join(process.cwd(), 'uploads', filename);


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

module.exports = router;
