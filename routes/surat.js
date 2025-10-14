const express = require('express')
const router = express.Router()
const pool = require('../db')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

// ===================== Middleware cek login =====================
function ensureLogin(req, res, next) {
  if (!req.session.user) return res.redirect('/login')
  next()
}

// ===================== Konfigurasi Upload =====================
const storage = multer.diskStorage({
  // destination: (req, file, cb) => cb(null, 'uploads/'),
  destination: (req, file, cb) => cb(null, 'Z:\\upload'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, Date.now() + '_' + file.originalname.replace(/\s+/g, '_'))
  },
})
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf')
      return cb(new Error('Hanya file PDF yang diperbolehkan!'))
    cb(null, true)
  },
})

// ===================== DAFTAR SURAT (server-side pagination) =====================
router.get('/surat', ensureLogin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit
    const q = req.query.q ? `%${req.query.q}%` : '%'

    const totalResult = await pool.query(
      `SELECT COUNT(*) AS count
      FROM surat_masuk a
      LEFT JOIN users b ON a.ditujukan_kepada = b.id
      WHERE a.nomor_surat ILIKE $1
          OR a.hal ILIKE $1
          OR a.dari ILIKE $1
          OR b.nama_lengkap ILIKE $1`,
      [q]
    )

    const totalRows = parseInt(totalResult.rows[0].count, 10)
    const totalPages = Math.ceil(totalRows / limit)

    const dataResult = await pool.query(
      `SELECT a.*, b.nama_lengkap
      FROM surat_masuk a
      LEFT JOIN users b ON a.ditujukan_kepada = b.id
      WHERE a.nomor_surat ILIKE $1
          OR a.hal ILIKE $1
          OR a.dari ILIKE $1
          OR b.nama_lengkap ILIKE $1
          
      ORDER BY a.tanggal_surat DESC
      LIMIT $2 OFFSET $3`,
      [q, limit, offset]
    )

    // pilih layout sesuai role
    const layoutFile =
      req.session.user.role === 'admin' ? 'layouts/admin' : 'layouts/user'

    res.render('surat/index', {
      title: 'Daftar Surat',
      user: req.session.user,
      surat: dataResult.rows,
      currentPage: page,
      totalPages,
      limit,
      searchQuery: req.query.q || '',
      activePage: 'surat',
      layout: layoutFile,
    })
  } catch (err) {
    console.error('Gagal mengambil surat:', err)
    res.status(500).send('Terjadi kesalahan server.')
  }
})

// API untuk data surat (AJAX)
router.get('/surat/data', ensureLogin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit
    const q = req.query.q ? `%${req.query.q}%` : '%'

    // total data
    const totalResult = await pool.query(
      `SELECT COUNT(*) AS count
      FROM surat_masuk a
      LEFT JOIN users b ON a.ditujukan_kepada = b.id
      WHERE a.nomor_surat ILIKE $1
          OR a.hal ILIKE $1
          OR a.dari ILIKE $1
          OR b.nama_lengkap ILIKE $1`,
      [q]
    )
    const totalRows = parseInt(totalResult.rows[0].count, 10)
    const totalPages = Math.ceil(totalRows / limit)

    // ambil data per halaman

    const dataResult = await pool.query(
      `SELECT a.*, b.nama_lengkap
      FROM surat_masuk a
      LEFT JOIN users b ON a.ditujukan_kepada = b.id
      WHERE a.nomor_surat ILIKE $1
          OR a.hal ILIKE $1
          OR a.dari ILIKE $1
          OR b.nama_lengkap ILIKE $1
      ORDER BY a.tanggal_surat DESC
      LIMIT $2 OFFSET $3`,
      [q, limit, offset]
    )

    res.json({
      data: dataResult.rows,
      currentPage: page,
      totalPages,
      limit,
      totalRows,
    })
  } catch (err) {
    console.error('Gagal ambil data surat:', err)
    res.status(500).json({ data: [], currentPage: 1, totalPages: 1 })
  }
})

// ===================== ROUTE UNDUH FILE PDF =====================
const UPLOAD_DIR = 'Z:\\upload' // pastikan disesuaikan jika beda path

router.get('/download/:filename', ensureLogin, (req, res) => {
  const { filename } = req.params

  // Validasi nama file agar aman
  const isSafeFilename = /^[a-zA-Z0-9_\-.]+$/.test(filename)
  if (!isSafeFilename) return res.status(400).send('Nama file tidak valid')

  const filePath = path.join(UPLOAD_DIR, filename)

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('File tidak ditemukan.')
    }

    // Kirim file ke browser
    res.sendFile(filePath)
  })
})

// ===================== FORM TAMBAH =====================
router.get('/surat/tambah', ensureLogin, async (req, res) => {
  try {
    const users = await pool.query(
      'SELECT id, nama_lengkap FROM users ORDER BY nama_lengkap'
    )

    const layoutFile =
      req.session.user.role === 'admin' ? 'layouts/admin' : 'layouts/user'

    res.render('surat/tambah', {
      title: 'Tambah Surat',
      user: req.session.user,
      users: users.rows, // kirim daftar user ke view
      layout: layoutFile,
      activePage: 'tambah',
      success: req.query.success || null,
      error: req.query.error || null,
      alert: null,
    })
  } catch (err) {
    console.error('Gagal load form tambah surat:', err)
    res.render('surat/tambah', {
      layout: 'layouts/admin',
      title: 'Tambah Surat',
      activePage: 'tambah',
      user: req.session.user,
      users: [],
      error: 'Terjadi kesalahan saat menampilkan form tambah surat.',
      alert: null,
    })
  }
})

// ===================== PROSES TAMBAH =====================
router.post(
  '/surat/tambah',
  ensureLogin,
  upload.single('file_pdf'),
  async (req, res) => {
    const {
      nomor_surat,
      hal,
      dari,
      ditujukan_kepada,
      tanggal_surat,
      tanggal_diterima,
      catatan,
      jenis_surat,
      sifat,
    } = req.body
    const nama_file = req.file ? req.file.filename : null

    try {
      // ✅ 1. Cek duplikasi nomor surat (sebelum lanjut)
      const cek = await pool.query(
        'SELECT COUNT(*) AS total FROM surat_masuk WHERE nomor_surat = $1',
        [nomor_surat]
      )

      if (parseInt(cek.rows[0].total) > 0) {
        // Ambil ulang daftar user untuk dropdown
        const users = await pool.query(
          'SELECT id, nama_lengkap FROM users ORDER BY nama_lengkap'
        )

        // ✅ Tampilkan pesan error tanpa masuk ke catch
        return res.render('surat/tambah', {
          title: 'Tambah Surat',
          activePage: 'tambah',
          alert: {
            type: 'error',
            message: `Nomor surat "${nomor_surat}" sudah terdaftar!`,
          },
          user: req.session.user,
          users: users.rows,
          layout:
            req.session.user.role === 'admin'
              ? 'layouts/admin'
              : 'layouts/user',
          success: null,
          error: null,
        })
      }

      // ✅ 2. Simpan surat
      const result = await pool.query(
        `INSERT INTO surat_masuk 
        (nomor_surat, hal, dari, ditujukan_kepada, tanggal_surat, tanggal_diterima, catatan, nama_file, jenis_surat, sifat, created_at) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())
       RETURNING id`,
        [
          nomor_surat,
          hal,
          dari,
          ditujukan_kepada,
          tanggal_surat || null,
          tanggal_diterima || null,
          catatan,
          nama_file,
          jenis_surat,
          sifat,
        ]
      )

      const suratId = result.rows[0].id

      // ✅ 3. Simpan notifikasi
      await pool.query(
        `INSERT INTO notifications (user_id, surat_id, message, is_read, created_at) 
       VALUES ($1, $2, $3, false, NOW())`,
        [ditujukan_kepada, suratId, `Anda menerima surat baru: ${hal}`]
      )

      // ✅ 4. Redirect dengan pesan sukses
      res.redirect('/surat/tambah?success=Surat berhasil ditambahkan!')
    } catch (err) {
      console.error('Gagal menambah surat:', err)
      res.redirect('/surat/tambah?error=Terjadi kesalahan saat menambah surat.')
    }
  }
)

// ===================== FORM EDIT =====================
router.get('/surat/edit/:id', ensureLogin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT a.*,b.nama_lengkap AS nama_user FROM	surat_masuk	a LEFT JOIN users b ON a.ditujukan_kepada = b.ID  WHERE a.id=$1',
      [req.params.id]
    )
    const users = await pool.query(
      'SELECT id, nama_lengkap FROM users ORDER BY nama_lengkap ASC'
    )
    if (result.rows.length === 0)
      return res.status(404).send('Surat tidak ditemukan')
    const layoutFile =
      req.session.user.role === 'admin' ? 'layouts/admin' : 'layouts/user'
    res.render('surat/edit', {
      title: 'Edit Surat',
      user: req.session.user,
      users: users.rows,
      surat: result.rows[0],
      layout: layoutFile,
      activePage: 'edit',
    })
  } catch (err) {
    console.error('Gagal mengambil surat:', err)
    res.status(500).send('Terjadi kesalahan server.')
  }
})

// ===================== PROSES EDIT =====================
router.post(
  '/surat/edit/:id',
  ensureLogin,
  upload.single('file_pdf'),
  async (req, res) => {
    const {
      nomor_surat,
      hal,
      dari,
      ditujukan_kepada,
      tanggal_surat,
      tanggal_diterima,
      catatan,
      jenis_surat,
      sifat,
    } = req.body
    const id = req.params.id

    try {
      // Ambil data lama
      const oldData = await pool.query(
        'SELECT nama_file FROM surat_masuk WHERE id=$1',
        [id]
      )
      if (oldData.rows.length === 0)
        return res.status(404).send('Surat tidak ditemukan')

      let nama_file = oldData.rows[0].nama_file

      // Jika ada file baru, hapus lama & ganti baru
      if (req.file) {
        if (nama_file) {
          const oldPath = path.join(__dirname, '..', 'uploads', nama_file)
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
        }
        nama_file = req.file.filename
      }

      await pool.query(
        `UPDATE surat_masuk 
       SET nomor_surat=$1, hal=$2, dari=$3, ditujukan_kepada=$4, tanggal_surat=$5, tanggal_diterima=$6, catatan=$7, nama_file=$8, jenis_surat=$9, sifat=$10
       WHERE id=$11`,
        [
          nomor_surat,
          hal,
          dari,
          ditujukan_kepada,
          tanggal_surat || null,
          tanggal_diterima || null,
          catatan,
          nama_file,
          jenis_surat,
          sifat,
          id,
        ]
      )

      res.redirect('/surat')
    } catch (err) {
      console.error('Gagal update surat:', err)
      res.status(500).send('Terjadi kesalahan server.')
    }
  }
)

// ===================== HAPUS =====================
router.post('/surat/hapusPermanen/:id', ensureLogin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT nama_file FROM surat_masuk WHERE id=$1',
      [req.params.id]
    )
    if (result.rows.length) {
      const file = result.rows[0].nama_file
      if (file) {
        const filePath = path.join('uploads', file)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
      }
    }

    await pool.query('DELETE FROM surat_masuk WHERE id=$1', [req.params.id])
    res.redirect('/surat')
  } catch (err) {
    console.error('Gagal hapus surat:', err)
    res.status(500).send('Terjadi kesalahan server.')
  }
})

// ===================== SOFT DELETE =====================
router.post('/surat/hapus/:id', ensureLogin, async (req, res) => {
  try {
    // tandai surat sudah dihapus, tapi file fisik tetap biar bisa recovery
    await pool.query(
      'UPDATE surat_masuk SET deleted_at = NOW() WHERE id = $1',
      [req.params.id]
    )

    res.redirect('/surat?success=Surat berhasil dihapus (soft delete).')
  } catch (err) {
    console.error('Gagal soft delete surat:', err)
    res.redirect('/surat?error=Terjadi kesalahan saat menghapus surat.')
  }
})

// ===================== RESTORE =====================
router.post('/surat/restore/:id', ensureLogin, async (req, res) => {
  try {
    await pool.query('UPDATE surat_masuk SET deleted_at = NULL WHERE id = $1', [
      req.params.id,
    ])
    res.redirect('/surat?success=Surat berhasil direstore.')
  } catch (err) {
    console.error('Gagal restore surat:', err)
    res.redirect('/surat?error=Terjadi kesalahan saat restore surat.')
  }
})

// ===================== DETAIL SURAT =====================
router.get('/surat/detail/:id', ensureLogin, async (req, res) => {
  try {
    const suratId = req.params.id

    // Cek data surat
    const result = await pool.query('SELECT * FROM surat_masuk WHERE id = $1', [
      suratId,
    ])

    if (result.rows.length === 0) {
      // Tidak ada data surat → 404
      return res.status(404).render('errors/404', {
        title: 'Surat Tidak Ditemukan',
        user: req.session.user,
        layout:
          req.session.user.role === 'admin' ? 'layouts/admin' : 'layouts/user',
      })
    }

    const surat = result.rows[0]

    // Kalau tidak ada nama_file → 404
    if (!surat.nama_file) {
      return res.status(404).render('errors/404', {
        title: 'File Surat Tidak Ditemukan',
        user: req.session.user,
        layout:
          req.session.user.role === 'admin' ? 'layouts/admin' : 'layouts/user',
      })
    }

    // Path file di folder uploads
    const filePath = path.join(__dirname, '..', 'uploads', surat.nama_file)

    // Kalau file ada → kirim PDF langsung
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath)
    }

    // Kalau file tidak ada → tampilkan 404
    return res.status(404).render('errors/404', {
      title: 'File Surat Tidak Ditemukan',
      user: req.session.user,
      activePage: '404',
      layout:
        req.session.user.role === 'admin' ? 'layouts/admin' : 'layouts/user',
      dashboardUrl:
        req.session.user.role === 'admin'
          ? '/admin/dashboard'
          : '/user/dashboard',
    })
  } catch (err) {
    console.error('Gagal load detail surat:', err)
    res.status(500).send('Terjadi kesalahan server.')
  }
})

// ===================== DAFTAR ARSIP (server-side pagination) =====================
router.get('/arsip', ensureLogin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit
    const q = req.query.q ? `%${req.query.q}%` : '%'

    // hitung total data arsip
    const totalResult = await pool.query(
      `SELECT COUNT(*) AS count
       FROM surat_masuk a
       LEFT JOIN users b ON a.ditujukan_kepada = b.id
       WHERE a.deleted_at IS NOT NULL
         AND (
           a.nomor_surat ILIKE $1
           OR a.hal ILIKE $1
           OR a.dari ILIKE $1
           OR b.nama_lengkap ILIKE $1
         )`,
      [q]
    )

    const totalRows = parseInt(totalResult.rows[0].count, 10)
    const totalPages = Math.ceil(totalRows / limit)

    // ambil data arsip per halaman
    const dataResult = await pool.query(
      `SELECT a.*, b.nama_lengkap
       FROM surat_masuk a
       LEFT JOIN users b ON a.ditujukan_kepada = b.id
       WHERE a.deleted_at IS NOT NULL
         AND (
           a.nomor_surat ILIKE $1
           OR a.hal ILIKE $1
           OR a.dari ILIKE $1
           OR b.nama_lengkap ILIKE $1
         )
       ORDER BY a.deleted_at DESC
       LIMIT $2 OFFSET $3`,
      [q, limit, offset]
    )

    // pilih layout sesuai role
    const layoutFile =
      req.session.user.role === 'admin' ? 'layouts/admin' : 'layouts/user'

    res.render('arsip', {
      title: 'Arsip Surat',
      user: req.session.user,
      arsip: dataResult.rows,
      currentPage: page,
      totalPages,
      limit,
      searchQuery: req.query.q || '',
      activePage: 'arsip',
      layout: layoutFile,
    })
  } catch (err) {
    console.error('Gagal mengambil arsip:', err)
    res.status(500).send('Terjadi kesalahan server.')
  }
})

// ===================== API ARSIP (AJAX) =====================
router.get('/arsip/data', ensureLogin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit
    const q = req.query.q ? `%${req.query.q}%` : '%'

    // total data arsip
    const totalResult = await pool.query(
      `SELECT COUNT(*) AS count
       FROM surat_masuk a
       LEFT JOIN users b ON a.ditujukan_kepada = b.id
       WHERE a.deleted_at IS NOT NULL
         AND (
           a.nomor_surat ILIKE $1
           OR a.hal ILIKE $1
           OR a.dari ILIKE $1
           OR b.nama_lengkap ILIKE $1
         )`,
      [q]
    )
    const totalRows = parseInt(totalResult.rows[0].count, 10)
    const totalPages = Math.ceil(totalRows / limit)

    // ambil data per halaman
    const dataResult = await pool.query(
      `SELECT a.*, b.nama_lengkap
       FROM surat_masuk a
       LEFT JOIN users b ON a.ditujukan_kepada = b.id
       WHERE a.deleted_at IS NOT NULL
         AND (
           a.nomor_surat ILIKE $1
           OR a.hal ILIKE $1
           OR a.dari ILIKE $1
           OR b.nama_lengkap ILIKE $1
         )
       ORDER BY a.deleted_at DESC
       LIMIT $2 OFFSET $3`,
      [q, limit, offset]
    )

    res.json({
      data: dataResult.rows,
      currentPage: page,
      totalPages,
      limit,
      totalRows,
    })
  } catch (err) {
    console.error('Gagal ambil data arsip:', err)
    res.status(500).json({ data: [], currentPage: 1, totalPages: 1 })
  }
})

module.exports = router
