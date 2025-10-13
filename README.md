create new db and this query for the table on db

-- ======================
-- TABLE: users
-- ======================
CREATE TABLE users (
id SERIAL PRIMARY KEY,
username VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL,
role VARCHAR(50) NOT NULL,
created_at TIMESTAMP,
email VARCHAR(255),
is_email_notif_enabled BOOLEAN DEFAULT FALSE,
updated_at TIMESTAMP,
deleted_at TIMESTAMP,
nama_lengkap VARCHAR(255),
jabatan VARCHAR(255)
);

-- ======================
-- TABLE: surat_masuk
-- ======================
CREATE TABLE surat_masuk (
id SERIAL PRIMARY KEY,
nomor_surat VARCHAR(255),
hal VARCHAR(255),
dari VARCHAR(255),
ditujukan_kepada INTEGER, -- ID pengguna atau entitas terkait
tanggal_surat DATE,
tanggal_diterima DATE,
catatan TEXT,
nama_file VARCHAR(255),
jenis_surat VARCHAR(50),
created_at TIMESTAMP,
updated_at TIMESTAMP,
deleted_at TIMESTAMP,
ditujukan_user_id INTEGER,
sifat VARCHAR(50)
);

-- ======================
-- TABLE: notifications
-- ======================
CREATE TABLE notifications (
id SERIAL PRIMARY KEY,
user_id INTEGER, -- ID user yang terkait dengan notifikasi
surat_id INTEGER, -- ID surat yang terkait dengan notifikasi
message TEXT, -- Pesan notifikasi
is_read BOOLEAN DEFAULT FALSE, -- Status apakah notifikasi sudah dibaca
created_at TIMESTAMP, -- Waktu notifikasi dibuat
read_at TIMESTAMP -- Waktu notifikasi dibaca
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
