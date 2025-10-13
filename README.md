create new db and this query for the table on db

-- ======================
-- TABLE: users
-- ======================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nama_lengkap VARCHAR(150) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- TABLE: surat_masuk
-- ======================
CREATE TABLE surat_masuk (
  id SERIAL PRIMARY KEY,
  nomor_surat VARCHAR(100) UNIQUE NOT NULL,
  hal TEXT NOT NULL,
  dari VARCHAR(150) NOT NULL,
  ditujukan_kepada INTEGER REFERENCES users(id) ON DELETE SET NULL,
  tanggal_surat DATE,
  tanggal_diterima DATE,
  catatan TEXT,
  nama_file VARCHAR(255),
  jenis_surat VARCHAR(50) CHECK (jenis_surat IN ('Masuk', 'Keluar')),
  sifat VARCHAR(50) CHECK (sifat IN ('Biasa', 'Penting', 'Rahasia')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);

-- ======================
-- TABLE: notifications
-- ======================
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  surat_id INTEGER REFERENCES surat_masuk(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- OPTIONAL: surat_keluar
-- ======================
CREATE TABLE surat_keluar (
  id SERIAL PRIMARY KEY,
  nomor_surat VARCHAR(100) UNIQUE NOT NULL,
  hal TEXT NOT NULL,
  kepada VARCHAR(150) NOT NULL,
  tanggal_surat DATE,
  catatan TEXT,
  nama_file VARCHAR(255),
  sifat VARCHAR(50) CHECK (sifat IN ('Biasa', 'Penting', 'Rahasia')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- ======================
-- INDEX tambahan (agar cepat di-search)
-- ======================
CREATE INDEX idx_surat_nomor ON surat_masuk(nomor_surat);
CREATE INDEX idx_surat_ditujukan ON surat_masuk(ditujukan_kepada);
CREATE INDEX idx_notif_user ON notifications(user_id);
CREATE INDEX idx_notif_surat ON notifications(surat_id);
