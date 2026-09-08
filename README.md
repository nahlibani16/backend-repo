# Fullstack Article Management Microservice

Aplikasi manajemen artikel full-stack yang terdiri dari **Backend Microservice (FastAPI + PostgreSQL Supabase)** dan **Frontend Admin Dashboard (React + Vite + Tailwind CSS)**.

---

## 📁 Struktur Project

```text
backend-repo/
├── app/                  # Backend FastAPI Microservice
│   ├── crud.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   └── schemas.py
├── article-frontend/     # Frontend React Admin Dashboard
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── requirements.txt      # Dependensi Backend Python
└── README.md
```
🚀 Cara Menjalankan Backend (FastAPI)
Masuk ke Root Folder:
```
Bash
cd backend-repo
```
Buat & Aktifkan Virtual Environment:
```
Bash
python -m venv venv
# Windows (CMD / PowerShell):
venv\Scripts\activate
```
Install Dependensi Python:
```
Bash
pip install -r requirements.txt
```
Jalankan Application Server:
```
Bash
uvicorn app.main:app --reload
```
Server Backend akan berjalan di: [http://127.0.0.1:8000](http://127.0.0.1:8000)

Dokumentasi Swagger UI Otomatis: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

💻 Cara Menjalankan Frontend (React + Vite)
Buka Terminal Baru & Masuk ke Folder Frontend:
```
Bash
cd article-frontend
```
Install Dependensi Node.js:
```
Bash
npm install
```
Jalankan Development Server:
```
Bash
npm run dev
```
Frontend akan berjalan di: http://localhost:5173

📋 Fitur Utama & Validasi
1. Backend Microservice
API Endpoints:

POST /article/ : Membuat artikel baru

GET /article/<limit>/<offset> : Menampilkan daftar artikel dengan pagination

GET /article/<id> : Menampilkan detail artikel berdasarkan ID

POST /article/<id> : Mengubah data artikel

POST /article/delete/<id> / DELETE /article/<id> : Memindahkan/menghapus artikel

Validasi Data (Pydantic):

title: Minimal 20 karakter

content: Minimal 200 karakter

category: Minimal 3 karakter

status: Harus memilih antara publish, draft, atau thrash

2. Frontend Admin Dashboard
All Posts Page: Memiliki tab Published, Drafts, dan Trashed dengan aksi Edit dan Trash.

Add New Page: Formulir pembuatan artikel baru dengan tombol Publish dan Draft.

Preview Blog Page: Menampilkan daftar artikel berkategori Publish dengan navigasi pagination.
