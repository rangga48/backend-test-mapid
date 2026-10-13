# Field Report Management API — MAPID Case Study

REST API untuk mengelola laporan lapangan (_Field Reports_) dengan backend Node.js, Express.js, TypeScript, dan database PostgreSQL (`pg`).

---

## 📋 Daftar Isi
1. [Tech Stack](#-tech-stack)
2. [Fitur & Kebutuhan Fungsional](#-fitur--kebutuhan-fungsional)
3. [Struktur Folder](#-struktur-folder)
4. [Skema Database](#-skema-database)
5. [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
6. [Dokumentasi API Endpoint](#-dokumentasi-api-endpoint)
7. [Contoh Pengujian (cURL)](#-contoh-pengujian-curl)

---

## 🛠 Tech Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Bahasa**: TypeScript
- **Database**: PostgreSQL (Support local PostgreSQL, Supabase, Neon)
- **Database Driver**: `pg` (node-postgres) dengan parameterized queries
- **Environment Management**: `dotenv`
- **CORS**: Didukung (`cors`) untuk kemudahan integrasi dengan Frontend

---

## 🎯 Fitur & Kebutuhan Fungsional
| ID | Fitur | Deskripsi |
|---|---|---|
| **FR-01** | **Create Report** | Menerima `name` dan `description`, memvalidasi input, menyimpan laporan baru dengan status `pending`. |
| **FR-02** | **Get Reports** | Mengambil seluruh daftar laporan dari PostgreSQL, terurut dari yang terbaru (`created_at DESC`). |
| **FR-03** | **Approve Report** | Mengubah status laporan menjadi `approved` berdasarkan ID (UUID). |
| **FR-04** | **Reject Report** | Mengubah status laporan menjadi `rejected` berdasarkan ID (UUID). |

---

## 📂 Struktur Folder
```
backend-test-mapid/
├── src/
│   ├── config/
│   │   └── database.ts          # Konfigurasi koneksi PostgreSQL Pool (pg)
│   ├── controllers/
│   │   └── report.controller.ts # Validasi request dan format response HTTP
│   ├── services/
│   │   └── report.service.ts    # Business logic & parameterized database queries
│   ├── routes/
│   │   └── report.routes.ts     # Definisi route Express /api/reports
│   ├── middlewares/
│   │   └── error.middleware.ts  # Global error & 404 not found handler
│   ├── scripts/
│   │   └── migrate.ts           # Script migrasi otomatis membaca schema.sql
│   ├── types/
│   │   └── report.types.ts      # TypeScript interfaces & types
│   ├── app.ts                   # Inisialisasi Express & middleware
│   └── server.ts                # Server entry point & graceful shutdown
├── schema.sql                   # Skema DDL pembuatan tabel PostgreSQL
├── .env.example                 # Template variabel lingkungan
├── .gitignore                   # Daftar file/folder yang diabaikan Git
├── package.json                 # Dependensi & NPM scripts
├── tsconfig.json                # Konfigurasi TypeScript compiler
└── README.md                    # Dokumentasi lengkap proyek
```

---

## 🗄 Skema Database (`schema.sql`)
Tabel `reports` memiliki struktur sebagai berikut:

| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | `UUID` | Primary Key, otomatis dibuat (`gen_random_uuid()`) |
| `name` | `VARCHAR(150)` | Wajib diisi (NOT NULL) |
| `description` | `TEXT` | Wajib diisi (NOT NULL) |
| `status` | `VARCHAR(20)` | Default `'pending'`, validasi CHECK (`'pending'`, `'approved'`, `'rejected'`) |
| `created_at` | `TIMESTAMPTZ` | Timestamp pembuatan (Default: `CURRENT_TIMESTAMP`) |
| `updated_at` | `TIMESTAMPTZ` | Timestamp pembaruan (Default: `CURRENT_TIMESTAMP`) |

File `schema.sql` sudah disiapkan di root folder dan dapat dieksekusi pada database kosong.

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Clone & Masuk ke Folder Proyek
```bash
git clone https://github.com/rangga48/backend-test-mapid.git
cd backend-test-mapid
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Variabel Lingkungan (`.env`)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi database di dalam file `.env`:
```env
PORT=3000
NODE_ENV=development

# Opsi 1: Menggunakan DATABASE_URL (Rekomendasi untuk Neon / Supabase / Cloud PG)
DATABASE_URL=postgresql://postgres:password@localhost:5432/field_reports_db

# Opsi 2: Parameter terpisah (jika DATABASE_URL tidak diisi)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=field_reports_db
DATABASE_SSL=false
```

### 4. Menjalankan Migrasi Database
Jalankan migrasi otomatis untuk membuat tabel `reports`:
```bash
npm run migrate
```
> Atau jalankan manual file `schema.sql` melalui psql atau GUI database (DBeaver, pgAdmin, Supabase SQL Editor).

### 5. Menjalankan Server

**Mode Development (dengan Hot Reload `tsx`):**
```bash
npm run dev
```

**Mode Production (Build & Start):**
```bash
npm run build
npm start
```

Server akan aktif di: `http://localhost:3000` (Base URL API: `http://localhost:3000/api/reports`).

---

## 📡 Dokumentasi API Endpoint

**Base URL**: `http://localhost:3000/api`

### 1. Health Check
- **Method**: `GET`
- **URL**: `/api/health`
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Field Report API is healthy",
  "timestamp": "2026-10-13T15:20:00.000Z"
}
```

---

### 2. Create Report (FR-01)
- **Method**: `POST`
- **URL**: `/api/reports`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "Pemeriksaan Area A",
  "description": "Ditemukan kerusakan pada pagar."
}
```
- **Response**: `201 Created`
```json
{
  "success": true,
  "message": "Report created successfully",
  "data": {
    "id": "e4c76b9a-4e89-4d23-93ab-f875b2b2b111",
    "name": "Pemeriksaan Area A",
    "description": "Ditemukan kerusakan pada pagar.",
    "status": "pending",
    "created_at": "2026-10-13T15:30:00.000Z",
    "updated_at": "2026-10-13T15:30:00.000Z"
  }
}
```

---

### 3. Get Reports (FR-02)
- **Method**: `GET`
- **URL**: `/api/reports`
- **Response**: `200 OK` (Urutan terbaru di atas)
```json
{
  "success": true,
  "message": "Reports retrieved successfully",
  "data": [
    {
      "id": "e4c76b9a-4e89-4d23-93ab-f875b2b2b111",
      "name": "Pemeriksaan Area A",
      "description": "Ditemukan kerusakan pada pagar.",
      "status": "pending",
      "created_at": "2026-10-13T15:30:00.000Z",
      "updated_at": "2026-10-13T15:30:00.000Z"
    }
  ]
}
```

---

### 4. Approve Report (FR-03)
- **Method**: `PATCH`
- **URL**: `/api/reports/:id/status`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "status": "approved"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Report status updated to approved successfully",
  "data": {
    "id": "e4c76b9a-4e89-4d23-93ab-f875b2b2b111",
    "name": "Pemeriksaan Area A",
    "description": "Ditemukan kerusakan pada pagar.",
    "status": "approved",
    "created_at": "2026-10-13T15:30:00.000Z",
    "updated_at": "2026-10-13T15:35:00.000Z"
  }
}
```

---

### 5. Reject Report (FR-04)
- **Method**: `PATCH`
- **URL**: `/api/reports/:id/status`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "status": "rejected"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Report status updated to rejected successfully",
  "data": {
    "id": "e4c76b9a-4e89-4d23-93ab-f875b2b2b111",
    "name": "Pemeriksaan Area A",
    "description": "Ditemukan kerusakan pada pagar.",
    "status": "rejected",
    "created_at": "2026-10-13T15:30:00.000Z",
    "updated_at": "2026-10-13T15:36:00.000Z"
  }
}
```

---

### 6. Format Respons Error
- **400 Bad Request** (Validasi input gagal atau format UUID salah):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Field 'name' is required and must not be empty"
  ]
}
```
- **404 Not Found** (Laporan tidak ditemukan):
```json
{
  "success": false,
  "message": "Report with ID 'e4c76b9a-4e89-4d23-93ab-f875b2b2b111' not found"
}
```
- **500 Internal Server Error** (Kegagalan tak terduga server):
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## 🧪 Contoh Pengujian (cURL)

#### 1. Buat Laporan Baru:
```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{"name": "Pemeriksaan Area A", "description": "Ditemukan kerusakan pada pagar."}'
```

#### 2. Ambil Semua Laporan:
```bash
curl -X GET http://localhost:3000/api/reports
```

#### 3. Setujui Laporan (Approve):
```bash
curl -X PATCH http://localhost:3000/api/reports/<ID_LAPORAN>/status \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

#### 4. Tolak Laporan (Reject):
```bash
curl -X PATCH http://localhost:3000/api/reports/<ID_LAPORAN>/status \
  -H "Content-Type: application/json" \
  -d '{"status": "rejected"}'
```