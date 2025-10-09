const express = require('express');
const router = express.Router();
const pool = require('../../db');
const { cekLogin } = require('../../middleware/auth');


router.use(cekLogin);
// Halaman user (pencarian + filter)
router.get('/user', async (req, res) => {
  const { q, ditujukan_kepada } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    let baseQuery = 'FROM surat_masuk WHERE deleted_at IS NULL';
    let filterQuery = '';
    let params = [];
    let count = 1;

    if (q) {
      filterQuery += ` AND (nomor_surat ILIKE $${count} OR hal ILIKE $${count} OR dari ILIKE $${count})`;
      params.push(`%${q}%`);
      count++;
    }

    if (ditujukan_kepada && ditujukan_kepada !== 'Semua') {
      filterQuery += ` AND ditujukan_kepada = $${count}`;
      params.push(ditujukan_kepada);
      count++;
    }

    const totalResult = await pool.query(`SELECT COUNT(*) ${baseQuery + filterQuery}`, params);
    const totalRows = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalRows / limit);

    const dataQuery = `SELECT * ${baseQuery + filterQuery} ORDER BY tanggal_surat DESC LIMIT $${count} OFFSET $${count + 1}`;
    const suratResult = await pool.query(dataQuery, [...params, limit, offset]);

    if (req.xhr) {
      // AJAX request → balikan JSON
      return res.json(suratResult.rows);
    }

    // Normal render
    res.render('user', {
      suratList: suratResult.rows,
      user: req.session.user,
      searchQuery: q || '',
      ditujukan_kepada,
      currentPage: page,
      totalPages,
      selectedLimit: limit
    });

  } catch (err) {
    console.error('Gagal mengambil data surat:', err);
    res.status(500).send('Terjadi kesalahan.');
  }
});



router.get('/home', (req, res) => {
  res.render('home');
});


// Tampilkan form edit
router.get('/edit/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM surat_masuk WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.send('Data tidak ditemukan');
    res.render('edit', { surat: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal mengambil data');
  }
});

// router.get('/user', async (req, res) => {
//   const { q, ditujukan_kepada } = req.query;
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const offset = (page - 1) * limit;

//   try {
//     let baseQuery = 'FROM surat_masuk WHERE deleted_at IS NULL';
//     let filterQuery = '';
//     let params = [];
//     let count = 1;

//     if (q) {
//       filterQuery += ` AND (nomor_surat ILIKE $${count} OR hal ILIKE $${count} OR dari ILIKE $${count})`;
//       params.push(`%${q}%`);
//       count++;
//     }

//     if (ditujukan_kepada && ditujukan_kepada !== 'Semua') {
//       filterQuery += ` AND ditujukan_kepada = $${count}`;
//       params.push(ditujukan_kepada);
//       count++;
//     }

//     const totalResult = await pool.query(`SELECT COUNT(*) ${baseQuery + filterQuery}`, params);
//     const totalRows = parseInt(totalResult.rows[0].count);
//     const totalPages = Math.ceil(totalRows / limit);

//     const dataQuery = `SELECT * ${baseQuery + filterQuery} ORDER BY tanggal_surat DESC LIMIT $${count} OFFSET $${count + 1}`;
//     const suratResult = await pool.query(dataQuery, [...params, limit, offset]);

// // 🔹 Cek host
// const host = req.get('host'); // contoh: "10.10.10.141:3000"
// const useFilesPath = host === '10.10.10.141:3000'; // cocokkan full IP + port

// res.render('user', {
//   suratList: suratResult.rows,
//   user: req.session.user,
//   searchQuery: q || '',
//   ditujukan_kepada,
//   currentPage: page,
//   totalPages,
//   selectedLimit: limit,
//   useFilesPath // kirim ke EJS
// });
//   } catch (err) {
//     console.error('Gagal mengambil data surat:', err);
//     res.status(500).send('Terjadi kesalahan.');
//   }
// });


// Proses update data
router.post('/edit/:id', async (req, res) => {
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
router.post('/delete/:id', async (req, res) => {
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


module.exports = router;
