# Sertifikat Web

Aplikasi web untuk menampilkan informasi kegiatan dan melakukan pencarian sertifikat peserta berdasarkan data yang tersimpan di Google Sheets.

## Fitur

- Menampilkan informasi kegiatan
- Menampilkan flyer kegiatan
- Menampilkan tautan Zoom
- Menampilkan tautan YouTube
- Menampilkan file pendukung
- Pencarian sertifikat peserta

## Teknologi

- Node.js
- Vercel Serverless Functions
- Google Sheets API
- Vanilla JavaScript
- HTML & CSS

## Struktur Project

```
api/
services/
public/
package.json
```

## Environment Variables

Buat file `.env` berdasarkan `.env.example`.

```
SPREADSHEET_ID=
GOOGLE_PROJECT_ID=
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
```

## Menjalankan Secara Lokal

```bash
npm install
```

```bash
npm run dev
```

atau sesuai script yang ada di `package.json`.

## Deployment

Project ini di-deploy menggunakan **Vercel** dengan GitHub Auto Deploy.