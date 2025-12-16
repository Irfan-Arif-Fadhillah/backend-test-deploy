# Panduan Testing di Postman

## Menjalankan Server
```bash
npm start
# atau
npm run dev
```

Server akan berjalan di: `http://localhost:3000`

> Pastikan file `.env` berisi kredensial PostgreSQL:
> ```
> PGHOST=localhost
> PGPORT=5432
> PGUSER=appuser
> PGPASSWORD=app_pass123
> PGDATABASE=dasar_backend_db
> PORT=3000
> ```

---

## Tampilan Web Sederhana (Register/Login)
- Buka: `http://localhost:3000/auth.html`
- Fungsi:
  - Register user baru (disimpan di PostgreSQL)
  - Login → dapat token
  - Tes GET/POST data terproteksi dengan token

---

## Setup Database PostgreSQL (pgAdmin4)
1. Buka pgAdmin4 → buat connection ke server PostgreSQL Anda.
2. Buat database, misalnya `dasar_backend_db`.
3. Jalankan SQL berikut untuk tabel user:
```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
4. Pastikan environment variable PostgreSQL sudah di-set sebelum `npm start`:
   - `PGHOST` (default `localhost`)
   - `PGPORT` (default `5432`)
   - `PGUSER` (default `postgres`)
   - `PGPASSWORD` (password db Anda)
   - `PGDATABASE` (default `dasar_backend_db`)

> Jika tidak set ENV, aplikasi akan pakai default di atas.

---

## Autentikasi (Wajib)

### Register User (sekali saja untuk buat akun)
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/register`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "username": "admin",
  "password": "admin123"
} 
```

### Login untuk Mendapatkan Token
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):** gunakan user yang sudah diregistrasi, contoh:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

- **Response Berhasil:**
```json
{
  "success": true,
  "message": "Login berhasil. Gunakan token pada header Authorization: Bearer <token>",
  "token": "<isi_token_acak>",
  "user": { "id": 1, "username": "admin" }
}
```

> Simpan token dari response, lalu kirim pada header `Authorization: Bearer <token>` untuk semua endpoint data di bawah ini.

---

## Endpoint Data (Terproteksi Token)

### 1. GET ALL - Ambil Semua Data
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/data`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Body:** Tidak perlu
- **Response:** JSON dengan semua data

**Contoh Response:**
```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": [
    { "id": 1, "nama": "Irfan", "umur": 20, "kota": "Jakarta" },
    { "id": 2, "nama": "Arif", "umur": 22, "kota": "Bandung" }
  ],
  "total": 2
}
```

---

### 2. GET BY ID - Ambil Data Berdasarkan ID
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/data/1`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Body:** Tidak perlu
- **Response:** JSON dengan data sesuai ID

**Contoh Response:**
```json
{
  "success": true,
  "message": "Data ditemukan",
  "data": {
    "id": 1,
    "nama": "Irfan",
    "umur": 20,
    "kota": "Jakarta"
  }
}
```

---

### 3. POST - Buat Data Baru
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/data`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Body (raw JSON):**
```json
{
  "nama": "Budi",
  "umur": 25,
  "kota": "Yogyakarta"
}
```

**Contoh Response:**
```json
{
  "success": true,
  "message": "Data berhasil dibuat",
  "data": {
    "id": 4,
    "nama": "Budi",
    "umur": 25,
    "kota": "Yogyakarta"
  }
}
```

---

### 4. PUT - Update Data
- **Method:** `PUT`
- **URL:** `http://localhost:3000/api/data/1`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Body (raw JSON):**
```json
{
  "nama": "Irfan Updated",
  "umur": 21,
  "kota": "Jakarta Selatan"
}
```

**Contoh Response:**
```json
{
  "success": true,
  "message": "Data berhasil diupdate",
  "data": {
    "id": 1,
    "nama": "Irfan Updated",
    "umur": 21,
    "kota": "Jakarta Selatan"
  }
}
```

---

### 5. DELETE - Hapus Data
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/data/1`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Body:** Tidak perlu
- **Response:** JSON konfirmasi penghapusan

**Contoh Response:**
```json
{
  "success": true,
  "message": "Data berhasil dihapus",
  "data": {
    "id": 1,
    "nama": "Irfan",
    "umur": 20,
    "kota": "Jakarta"
  }
}
```

---

## Cara Test di Postman

1. **Buka Postman**
2. **Login dulu** ke `POST http://localhost:3000/api/auth/login` (body: username & password)
3. **Salin token** dari response
4. **Set Header Authorization**: pilih tab "Headers" → key `Authorization` → value `Bearer <token>`
5. **Pilih Method** (GET, POST, PUT, DELETE) dan URL endpoint data
6. **Untuk POST/PUT:** tab "Body" → pilih "raw" → pilih "JSON" → isi body sesuai contoh
7. **Klik "Send"** dan lihat response JSON

---

## Catatan
- Data disimpan di memory (akan hilang saat server restart)
- Semua response dalam format JSON
- ID otomatis dibuat saat POST (increment dari ID tertinggi)
- Token juga disimpan di memory; jika server restart, login lagi untuk token baru

