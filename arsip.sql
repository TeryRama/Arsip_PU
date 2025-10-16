/*
 Navicat Premium Data Transfer

 Source Server         : postgre
 Source Server Type    : PostgreSQL
 Source Server Version : 160003 (160003)
 Source Host           : localhost:5432
 Source Catalog        : coba
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 160003 (160003)
 File Encoding         : 65001

 Date: 15/10/2025 10:19:54
*/


-- ----------------------------
-- Sequence structure for email_logs_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."email_logs_id_seq";
CREATE SEQUENCE "public"."email_logs_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for notifications_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."notifications_id_seq";
CREATE SEQUENCE "public"."notifications_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for surat_masuk_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."surat_masuk_id_seq";
CREATE SEQUENCE "public"."surat_masuk_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for users_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."users_id_seq";
CREATE SEQUENCE "public"."users_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for email_logs
-- ----------------------------
DROP TABLE IF EXISTS "public"."email_logs";
CREATE TABLE "public"."email_logs" (
  "id" int4 NOT NULL DEFAULT nextval('email_logs_id_seq'::regclass),
  "user_id" int4,
  "subject" varchar(255) COLLATE "pg_catalog"."default",
  "body" text COLLATE "pg_catalog"."default",
  "status" varchar(50) COLLATE "pg_catalog"."default",
  "error_message" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of email_logs
-- ----------------------------

-- ----------------------------
-- Table structure for notifications
-- ----------------------------
DROP TABLE IF EXISTS "public"."notifications";
CREATE TABLE "public"."notifications" (
  "id" int4 NOT NULL DEFAULT nextval('notifications_id_seq'::regclass),
  "user_id" int4 NOT NULL,
  "surat_id" int4,
  "message" text COLLATE "pg_catalog"."default" NOT NULL,
  "is_read" bool DEFAULT false,
  "created_at" timestamp(6) DEFAULT now(),
  "read_at" timestamp(6)
)
;

-- ----------------------------
-- Records of notifications
-- ----------------------------
INSERT INTO "public"."notifications" VALUES (1, 3, 126, 'Anda menerima surat baru: Pemberitahuan Pelaksanaan Pelatihan Dasar CPNS angkatan XXI s.d XXVII tahun 2025', 't', '2025-09-29 09:58:46.963955', '2025-10-01 08:43:12.542234');
INSERT INTO "public"."notifications" VALUES (2, 3, 127, 'Anda menerima surat baru: coba', 'f', '2025-10-02 00:04:08.699816', NULL);
INSERT INTO "public"."notifications" VALUES (3, 3, 128, 'Anda menerima surat baru: 123', 'f', '2025-10-02 09:05:49.333559', NULL);
INSERT INTO "public"."notifications" VALUES (4, 3, 129, 'Anda menerima surat baru: 12', 'f', '2025-10-02 09:06:14.990443', NULL);
INSERT INTO "public"."notifications" VALUES (5, 3, 130, 'Anda menerima surat baru: 123', 'f', '2025-10-02 09:14:54.172817', NULL);
INSERT INTO "public"."notifications" VALUES (6, 3, 131, 'Anda menerima surat baru: asd', 'f', '2025-10-02 13:35:55.731259', NULL);

-- ----------------------------
-- Table structure for surat_masuk
-- ----------------------------
DROP TABLE IF EXISTS "public"."surat_masuk";
CREATE TABLE "public"."surat_masuk" (
  "id" int4 NOT NULL DEFAULT nextval('surat_masuk_id_seq'::regclass),
  "nomor_surat" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "hal" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "dari" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "ditujukan_kepada" int4 NOT NULL,
  "tanggal_surat" date NOT NULL,
  "tanggal_diterima" date NOT NULL,
  "catatan" text COLLATE "pg_catalog"."default",
  "nama_file" text COLLATE "pg_catalog"."default" NOT NULL,
  "jenis_surat" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6),
  "updated_at" timestamp(6),
  "deleted_at" timestamp(6),
  "ditujukan_user_id" int4,
  "sifat" varchar(50) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of surat_masuk
-- ----------------------------
INSERT INTO "public"."surat_masuk" VALUES (33, 'NS-8', 'Hal 8', 'Instansi 9', 3, '2025-09-16', '2025-09-18', 'Catatan untuk surat ke-8', 'dummy_8.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (32, 'NS-7', 'Hal 7', 'Instansi 8', 3, '2025-09-17', '2025-09-19', 'Catatan untuk surat ke-7', 'dummy_7.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (31, 'NS-6', 'Hal 6', 'Instansi 7', 3, '2025-09-18', '2025-09-20', 'Catatan untuk surat ke-6', 'dummy_6.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (30, 'NS-5', 'Hal 5', 'Instansi 6', 3, '2025-09-19', '2025-09-21', 'Catatan untuk surat ke-5', 'dummy_5.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (29, 'NS-4', 'Hal 4', 'Instansi 5', 3, '2025-09-20', '2025-09-22', 'Catatan untuk surat ke-4', 'dummy_4.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (28, 'NS-3', 'Hal 3', 'Instansi 4', 3, '2025-09-21', '2025-09-23', 'Catatan untuk surat ke-3', 'dummy_3.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (27, 'NS-2', 'Hal 2', 'Instansi 3', 3, '2025-09-22', '2025-09-24', 'Catatan untuk surat ke-2', 'dummy_2.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (26, 'NS-1', 'Hal 1', 'Instansi 2', 3, '2025-09-23', '2025-09-25', 'Catatan untuk surat ke-1', 'dummy_1.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (25, 'asd800.2.2/484/BKPSDM-P2KP', 'nah Pemberitahuan Pelaksanaan Pelatihan Dasar CPNS angkatan XXI s.d XXVII tahun 2025', 'BKPSDM', 3, '2025-09-15', '2025-09-15', 'tes', '20250915_094955_Renstra_DPU_new.pdf', 'Surat Masuk', '2025-09-15 09:49:55.363134', NULL, NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (23, '2800.2.2/484/BKPSDM-P2KP', 'nah Pemberitahuan Pelaksanaan Pelatihan Dasar CPNS angkatan XXI s.d XXVII tahun 2025', 'aBKPSDM', 3, '2025-09-16', '2025-09-16', 'asd', '20250915_092032_Final-Surat-ke-Perangkat-Daerah-tentang-Penyelenggaraan-Pelatihan-Dasar-CPNS-Angkatan-XXI-s.d.-XXVII-Tahun-2025.pdf', 'Surat Masuk', '2025-09-15 09:20:32.554207', NULL, NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (87, 'NS-62', 'Hal 62', 'Instansi 3', 3, '2025-07-24', '2025-07-26', 'Catatan untuk surat ke-62', 'dummy_62.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (86, 'NS-61', 'Hal 61', 'Instansi 2', 3, '2025-07-25', '2025-07-27', 'Catatan untuk surat ke-61', 'dummy_61.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (85, 'NS-60', 'Hal 60', 'Instansi 1', 3, '2025-07-26', '2025-07-28', 'Catatan untuk surat ke-60', 'dummy_60.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (84, 'NS-59', 'Hal 59', 'Instansi 10', 3, '2025-07-27', '2025-07-29', 'Catatan untuk surat ke-59', 'dummy_59.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (83, 'NS-58', 'Hal 58', 'Instansi 9', 3, '2025-07-28', '2025-07-30', 'Catatan untuk surat ke-58', 'dummy_58.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (82, 'NS-57', 'Hal 57', 'Instansi 8', 3, '2025-07-29', '2025-07-31', 'Catatan untuk surat ke-57', 'dummy_57.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (81, 'NS-56', 'Hal 56', 'Instansi 7', 3, '2025-07-30', '2025-08-01', 'Catatan untuk surat ke-56', 'dummy_56.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (80, 'NS-55', 'Hal 55', 'Instansi 6', 3, '2025-07-31', '2025-08-02', 'Catatan untuk surat ke-55', 'dummy_55.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (79, 'NS-54', 'Hal 54', 'Instansi 5', 3, '2025-08-01', '2025-08-03', 'Catatan untuk surat ke-54', 'dummy_54.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (78, 'NS-53', 'Hal 53', 'Instansi 4', 3, '2025-08-02', '2025-08-04', 'Catatan untuk surat ke-53', 'dummy_53.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (77, 'NS-52', 'Hal 52', 'Instansi 3', 3, '2025-08-03', '2025-08-05', 'Catatan untuk surat ke-52', 'dummy_52.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (76, 'NS-51', 'Hal 51', 'Instansi 2', 3, '2025-08-04', '2025-08-06', 'Catatan untuk surat ke-51', 'dummy_51.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (75, 'NS-50', 'Hal 50', 'Instansi 1', 3, '2025-08-05', '2025-08-07', 'Catatan untuk surat ke-50', 'dummy_50.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (74, 'NS-49', 'Hal 49', 'Instansi 10', 3, '2025-08-06', '2025-08-08', 'Catatan untuk surat ke-49', 'dummy_49.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (73, 'NS-48', 'Hal 48', 'Instansi 9', 3, '2025-08-07', '2025-08-09', 'Catatan untuk surat ke-48', 'dummy_48.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (72, 'NS-47', 'Hal 47', 'Instansi 8', 3, '2025-08-08', '2025-08-10', 'Catatan untuk surat ke-47', 'dummy_47.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (71, 'NS-46', 'Hal 46', 'Instansi 7', 3, '2025-08-09', '2025-08-11', 'Catatan untuk surat ke-46', 'dummy_46.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (70, 'NS-45', 'Hal 45', 'Instansi 6', 3, '2025-08-10', '2025-08-12', 'Catatan untuk surat ke-45', 'dummy_45.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (69, 'NS-44', 'Hal 44', 'Instansi 5', 3, '2025-08-11', '2025-08-13', 'Catatan untuk surat ke-44', 'dummy_44.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (67, 'NS-42', 'Hal 42', 'Instansi 3', 3, '2025-08-13', '2025-08-15', 'Catatan untuk surat ke-42', 'dummy_42.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (65, 'NS-40', 'Hal 40', 'Instansi 1', 3, '2025-08-15', '2025-08-17', 'Catatan untuk surat ke-40', 'dummy_40.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (64, 'NS-39', 'Hal 39', 'Instansi 10', 3, '2025-08-16', '2025-08-18', 'Catatan untuk surat ke-39', 'dummy_39.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (63, 'NS-38', 'Hal 38', 'Instansi 9', 3, '2025-08-17', '2025-08-19', 'Catatan untuk surat ke-38', 'dummy_38.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (61, 'NS-36', 'Hal 36', 'Instansi 7', 3, '2025-08-19', '2025-08-21', 'Catatan untuk surat ke-36', 'dummy_36.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (60, 'NS-35', 'Hal 35', 'Instansi 6', 3, '2025-08-20', '2025-08-22', 'Catatan untuk surat ke-35', 'dummy_35.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (59, 'NS-34', 'Hal 34', 'Instansi 5', 3, '2025-08-21', '2025-08-23', 'Catatan untuk surat ke-34', 'dummy_34.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (58, 'NS-33', 'Hal 33', 'Instansi 4', 3, '2025-08-22', '2025-08-24', 'Catatan untuk surat ke-33', 'dummy_33.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (57, 'NS-32', 'Hal 32', 'Instansi 3', 3, '2025-08-23', '2025-08-25', 'Catatan untuk surat ke-32', 'dummy_32.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (56, 'NS-31', 'Hal 31', 'Instansi 2', 3, '2025-08-24', '2025-08-26', 'Catatan untuk surat ke-31', 'dummy_31.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (55, 'NS-30', 'Hal 30', 'Instansi 1', 3, '2025-08-25', '2025-08-27', 'Catatan untuk surat ke-30', 'dummy_30.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (54, 'NS-29', 'Hal 29', 'Instansi 10', 3, '2025-08-26', '2025-08-28', 'Catatan untuk surat ke-29', 'dummy_29.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (53, 'NS-28', 'Hal 28', 'Instansi 9', 3, '2025-08-27', '2025-08-29', 'Catatan untuk surat ke-28', 'dummy_28.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (52, 'NS-27', 'Hal 27', 'Instansi 8', 3, '2025-08-28', '2025-08-30', 'Catatan untuk surat ke-27', 'dummy_27.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (51, 'NS-26', 'Hal 26', 'Instansi 7', 3, '2025-08-29', '2025-08-31', 'Catatan untuk surat ke-26', 'dummy_26.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (50, 'NS-25', 'Hal 25', 'Instansi 6', 3, '2025-08-30', '2025-09-01', 'Catatan untuk surat ke-25', 'dummy_25.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (49, 'NS-24', 'Hal 24', 'Instansi 5', 3, '2025-08-31', '2025-09-02', 'Catatan untuk surat ke-24', 'dummy_24.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (48, 'NS-23', 'Hal 23', 'Instansi 4', 3, '2025-09-01', '2025-09-03', 'Catatan untuk surat ke-23', 'dummy_23.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (47, 'NS-22', 'Hal 22', 'Instansi 3', 3, '2025-09-02', '2025-09-04', 'Catatan untuk surat ke-22', 'dummy_22.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (46, 'NS-21', 'Hal 21', 'Instansi 2', 3, '2025-09-03', '2025-09-05', 'Catatan untuk surat ke-21', 'dummy_21.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (45, 'NS-20', 'Hal 20', 'Instansi 1', 3, '2025-09-04', '2025-09-06', 'Catatan untuk surat ke-20', 'dummy_20.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (44, 'NS-19', 'Hal 19', 'Instansi 10', 3, '2025-09-05', '2025-09-07', 'Catatan untuk surat ke-19', 'dummy_19.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (43, 'NS-18', 'Hal 18', 'Instansi 9', 3, '2025-09-06', '2025-09-08', 'Catatan untuk surat ke-18', 'dummy_18.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (42, 'NS-17', 'Hal 17', 'Instansi 8', 3, '2025-09-07', '2025-09-09', 'Catatan untuk surat ke-17', 'dummy_17.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (62, 'NS-37', 'Hal 37', 'Instansi 8', 3, '2025-08-18', '2025-08-20', 'Catatan untuk surat ke-37', 'dummy_37.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (41, 'NS-16', 'Hal 16', 'Instansi 7', 3, '2025-09-08', '2025-09-10', 'Catatan untuk surat ke-16', 'dummy_16.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (40, 'NS-15', 'Hal 15', 'Instansi 6', 3, '2025-09-09', '2025-09-11', 'Catatan untuk surat ke-15', 'dummy_15.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (39, 'NS-14', 'Hal 14', 'Instansi 5', 3, '2025-09-10', '2025-09-12', 'Catatan untuk surat ke-14', 'dummy_14.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (38, 'NS-13', 'Hal 13', 'Instansi 4', 3, '2025-09-11', '2025-09-13', 'Catatan untuk surat ke-13', 'dummy_13.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (37, 'NS-12', 'Hal 12', 'Instansi 3', 3, '2025-09-12', '2025-09-14', 'Catatan untuk surat ke-12', 'dummy_12.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (36, 'NS-11', 'Hal 11', 'Instansi 2', 3, '2025-09-13', '2025-09-15', 'Catatan untuk surat ke-11', 'dummy_11.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (35, 'NS-10', 'Hal 10', 'Instansi 1', 3, '2025-09-14', '2025-09-16', 'Catatan untuk surat ke-10', 'dummy_10.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (34, 'NS-9', 'Hal 9', 'Instansi 10', 3, '2025-09-15', '2025-09-17', 'Catatan untuk surat ke-9', 'dummy_9.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (126, '123', 'Pemberitahuan Pelaksanaan Pelatihan Dasar CPNS angkatan XXI s.d XXVII tahun 2025', 'BKPSDM', 3, '2025-09-29', '2025-09-29', 'tes coba', '1759114726887_cover.pdf', 'masuk', '2025-09-29 09:58:46.942649', NULL, NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (125, 'NS-100', 'Hal 100', 'Instansi 1', 3, '2025-06-16', '2025-06-18', 'Catatan untuk surat ke-100', 'dummy_100.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (124, 'NS-99', 'Hal 99', 'Instansi 10', 3, '2025-06-17', '2025-06-19', 'Catatan untuk surat ke-99', 'dummy_99.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (123, 'NS-98', 'Hal 98', 'Instansi 9', 3, '2025-06-18', '2025-06-20', 'Catatan untuk surat ke-98', 'dummy_98.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (122, 'NS-97', 'Hal 97', 'Instansi 8', 3, '2025-06-19', '2025-06-21', 'Catatan untuk surat ke-97', 'dummy_97.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (121, 'NS-96', 'Hal 96', 'Instansi 7', 3, '2025-06-20', '2025-06-22', 'Catatan untuk surat ke-96', 'dummy_96.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (120, 'NS-95', 'Hal 95', 'Instansi 6', 3, '2025-06-21', '2025-06-23', 'Catatan untuk surat ke-95', 'dummy_95.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (119, 'NS-94', 'Hal 94', 'Instansi 5', 3, '2025-06-22', '2025-06-24', 'Catatan untuk surat ke-94', 'dummy_94.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (118, 'NS-93', 'Hal 93', 'Instansi 4', 3, '2025-06-23', '2025-06-25', 'Catatan untuk surat ke-93', 'dummy_93.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (117, 'NS-92', 'Hal 92', 'Instansi 3', 3, '2025-06-24', '2025-06-26', 'Catatan untuk surat ke-92', 'dummy_92.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (116, 'NS-91', 'Hal 91', 'Instansi 2', 3, '2025-06-25', '2025-06-27', 'Catatan untuk surat ke-91', 'dummy_91.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (115, 'NS-90', 'Hal 90', 'Instansi 1', 3, '2025-06-26', '2025-06-28', 'Catatan untuk surat ke-90', 'dummy_90.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (114, 'NS-89', 'Hal 89', 'Instansi 10', 3, '2025-06-27', '2025-06-29', 'Catatan untuk surat ke-89', 'dummy_89.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (113, 'NS-88', 'Hal 88', 'Instansi 9', 3, '2025-06-28', '2025-06-30', 'Catatan untuk surat ke-88', 'dummy_88.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (112, 'NS-87', 'Hal 87', 'Instansi 8', 3, '2025-06-29', '2025-07-01', 'Catatan untuk surat ke-87', 'dummy_87.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (111, 'NS-86', 'Hal 86', 'Instansi 7', 3, '2025-06-30', '2025-07-02', 'Catatan untuk surat ke-86', 'dummy_86.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (110, 'NS-85', 'Hal 85', 'Instansi 6', 3, '2025-07-01', '2025-07-03', 'Catatan untuk surat ke-85', 'dummy_85.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (109, 'NS-84', 'Hal 84', 'Instansi 5', 3, '2025-07-02', '2025-07-04', 'Catatan untuk surat ke-84', 'dummy_84.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (108, 'NS-83', 'Hal 83', 'Instansi 4', 3, '2025-07-03', '2025-07-05', 'Catatan untuk surat ke-83', 'dummy_83.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (107, 'NS-82', 'Hal 82', 'Instansi 3', 3, '2025-07-04', '2025-07-06', 'Catatan untuk surat ke-82', 'dummy_82.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (106, 'NS-81', 'Hal 81', 'Instansi 2', 3, '2025-07-05', '2025-07-07', 'Catatan untuk surat ke-81', 'dummy_81.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (105, 'NS-80', 'Hal 80', 'Instansi 1', 3, '2025-07-06', '2025-07-08', 'Catatan untuk surat ke-80', 'dummy_80.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (104, 'NS-79', 'Hal 79', 'Instansi 10', 3, '2025-07-07', '2025-07-09', 'Catatan untuk surat ke-79', 'dummy_79.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (103, 'NS-78', 'Hal 78', 'Instansi 9', 3, '2025-07-08', '2025-07-10', 'Catatan untuk surat ke-78', 'dummy_78.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (102, 'NS-77', 'Hal 77', 'Instansi 8', 3, '2025-07-09', '2025-07-11', 'Catatan untuk surat ke-77', 'dummy_77.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (101, 'NS-76', 'Hal 76', 'Instansi 7', 3, '2025-07-10', '2025-07-12', 'Catatan untuk surat ke-76', 'dummy_76.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (100, 'NS-75', 'Hal 75', 'Instansi 6', 3, '2025-07-11', '2025-07-13', 'Catatan untuk surat ke-75', 'dummy_75.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (99, 'NS-74', 'Hal 74', 'Instansi 5', 3, '2025-07-12', '2025-07-14', 'Catatan untuk surat ke-74', 'dummy_74.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (98, 'NS-73', 'Hal 73', 'Instansi 4', 3, '2025-07-13', '2025-07-15', 'Catatan untuk surat ke-73', 'dummy_73.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (97, 'NS-72', 'Hal 72', 'Instansi 3', 3, '2025-07-14', '2025-07-16', 'Catatan untuk surat ke-72', 'dummy_72.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (96, 'NS-71', 'Hal 71', 'Instansi 2', 3, '2025-07-15', '2025-07-17', 'Catatan untuk surat ke-71', 'dummy_71.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (95, 'NS-70', 'Hal 70', 'Instansi 1', 3, '2025-07-16', '2025-07-18', 'Catatan untuk surat ke-70', 'dummy_70.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (94, 'NS-69', 'Hal 69', 'Instansi 10', 3, '2025-07-17', '2025-07-19', 'Catatan untuk surat ke-69', 'dummy_69.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (93, 'NS-68', 'Hal 68', 'Instansi 9', 3, '2025-07-18', '2025-07-20', 'Catatan untuk surat ke-68', 'dummy_68.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (92, 'NS-67', 'Hal 67', 'Instansi 8', 3, '2025-07-19', '2025-07-21', 'Catatan untuk surat ke-67', 'dummy_67.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (91, 'NS-66', 'Hal 66', 'Instansi 7', 3, '2025-07-20', '2025-07-22', 'Catatan untuk surat ke-66', 'dummy_66.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (90, 'NS-65', 'Hal 65', 'Instansi 6', 3, '2025-07-21', '2025-07-23', 'Catatan untuk surat ke-65', 'dummy_65.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (89, 'NS-64', 'Hal 64', 'Instansi 5', 3, '2025-07-22', '2025-07-24', 'Catatan untuk surat ke-64', 'dummy_64.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (88, 'NS-63', 'Hal 63', 'Instansi 4', 3, '2025-07-23', '2025-07-25', 'Catatan untuk surat ke-63', 'dummy_63.pdf', 'Keluar', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (66, 'NS-41', 'Hal 41', 'Instansi 2', 3, '2025-08-14', '2025-08-16', 'Catatan untuk surat ke-41', 'dummy_41.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (68, 'NS-43', 'Hal 43', 'Instansi 4', 3, '2025-08-12', '2025-08-14', 'Catatan untuk surat ke-43', 'dummy_43.pdf', 'Masuk', '2025-09-24 10:34:26.608753', '2025-09-24 10:34:26.608753', NULL, NULL, NULL);
INSERT INTO "public"."surat_masuk" VALUES (129, '12', '12', '123', 3, '2025-10-02', '2025-10-02', '123', '1759370774984_cover.pdf', 'masuk', '2025-10-02 09:06:14.987897', NULL, '2025-10-02 12:51:42.240558', NULL, 'Biasa');
INSERT INTO "public"."surat_masuk" VALUES (131, 'asd', 'asd', 'asd', 3, '2025-11-02', '2025-11-02', 'asd', '1759386955708_cover.pdf', 'masuk', '2025-10-02 13:35:55.72139', NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  "username" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "password" text COLLATE "pg_catalog"."default" NOT NULL,
  "role" varchar(20) COLLATE "pg_catalog"."default" NOT NULL DEFAULT 'user'::character varying,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "email" varchar(255) COLLATE "pg_catalog"."default",
  "is_email_notif_enabled" bool DEFAULT false,
  "updated_at" timestamp(6),
  "deleted_at" timestamp(6),
  "nama_lengkap" varchar(255) COLLATE "pg_catalog"."default",
  "jabatan" varchar(255) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO "public"."users" VALUES (1, 'admin', '$2b$10$XsXIiN1PxYkZUGiQaIwTwe2jQI7WCXO7vXGQPKUYBD2U3kZyeA1IC', 'admin', '2025-08-01 15:26:45.383509', NULL, 'f', NULL, NULL, 'Tengku Ryan', NULL);
INSERT INTO "public"."users" VALUES (2, 'user', '$2b$10$hvZGaDkFP4KJm.f/JtApvOePxqJEvLbdjm3ovpp5rWuMnhDJtGprC', 'user', '2025-08-01 16:11:37.234435', NULL, 'f', NULL, NULL, 'uhuy', NULL);
INSERT INTO "public"."users" VALUES (3, 'asd', '$2b$10$Lrx2kOvqXBt3i/wslOXtpOfKk378Ge8LsSYaGP7LLlz3iPWocae3O', 'user', '2025-09-24 15:45:29.076634', 'asd@gmail.com', 'f', '2025-09-24 15:45:29.076634', NULL, 'Ryan', NULL);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."email_logs_id_seq"
OWNED BY "public"."email_logs"."id";
SELECT setval('"public"."email_logs_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."notifications_id_seq"
OWNED BY "public"."notifications"."id";
SELECT setval('"public"."notifications_id_seq"', 6, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."surat_masuk_id_seq"
OWNED BY "public"."surat_masuk"."id";
SELECT setval('"public"."surat_masuk_id_seq"', 131, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."users_id_seq"
OWNED BY "public"."users"."id";
SELECT setval('"public"."users_id_seq"', 3, true);

-- ----------------------------
-- Primary Key structure for table email_logs
-- ----------------------------
ALTER TABLE "public"."email_logs" ADD CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table notifications
-- ----------------------------
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table surat_masuk
-- ----------------------------
ALTER TABLE "public"."surat_masuk" ADD CONSTRAINT "surat_masuk_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_username_key" UNIQUE ("username");
ALTER TABLE "public"."users" ADD CONSTRAINT "users_email_key" UNIQUE ("email");

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table email_logs
-- ----------------------------
ALTER TABLE "public"."email_logs" ADD CONSTRAINT "email_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table notifications
-- ----------------------------
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table surat_masuk
-- ----------------------------
ALTER TABLE "public"."surat_masuk" ADD CONSTRAINT "surat_masuk_ditujukan_user_id_fkey" FOREIGN KEY ("ditujukan_user_id") REFERENCES "public"."users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION;
