# Portal Kegiatan DTDP

Portal informasi dan arsip kegiatan Direktorat Teknologi dan Digitalisasi Pembelajaran, Lembaga Administrasi Negara (VPL, webinar, dan lainnya), termasuk pencarian sertifikat peserta. Data diambil dari Google Sheets.

## Fitur

- Daftar kegiatan aktif dengan pencarian, pagination, dan status otomatis (Akan Datang / Sedang Berlangsung / Selesai, berdasarkan WIB)
- Detail kegiatan: informasi, flyer, presensi, tautan Zoom/YouTube, virtual background, file pendukung
- Pencarian sertifikat peserta per kegiatan
- Popup Survei Kepuasan Masyarakat (SKM)

## Teknologi

- [Nuxt 4](https://nuxt.com) (Vue 3, SSR) dan Nitro server routes
- Google Sheets API (`@googleapis/sheets`, service account read-only)
- Deploy di Vercel (GitHub Auto Deploy)

## Struktur Project

```
app/
  app.vue                  Layout global (popup SKM, Vercel Analytics)
  pages/index.vue          Beranda: daftar, pencarian, pagination kegiatan
  pages/kegiatan/[kode].vue Detail kegiatan (tab info, sertifikat, presensi, siaran, files)
  components/              KegiatanCard, HotlineCard, SkmPopup
  utils/                   Status kegiatan (WIB), format tanggal/waktu, link Google Drive
server/
  api/kegiatan-list.get.ts   GET /api/kegiatan-list
  api/kegiatan-detail.get.ts GET /api/kegiatan-detail?kode=
  api/sertifikat.get.ts      GET /api/sertifikat?keyword=&kode=
  api/status.get.ts          GET /api/status (health check)
  middleware/legacy-redirect.ts  Redirect URL lama (/pages/kegiatan.html?kode=...)
  utils/                   Koneksi Google Sheets, cache 5 menit, query kegiatan & sertifikat
shared/types/              Tipe data yang dipakai app dan server
public/                    CSS dan gambar statis
test/                      Skrip load test k6
```

## Struktur Spreadsheet

- Sheet **`Kegiatan`**, kolom A–M: status, kode, nama, flyer, tanggal (DD/MM/YYYY), waktu mulai, waktu selesai, deskripsi, zoom, youtube, virtual background, presensi, files. Hanya baris berstatus `Aktif` yang tampil di beranda.
- **Satu sheet per kegiatan** dengan nama sheet = kode kegiatan, kolom A–D: nama, instansi, kegiatan, link sertifikat.

## Environment Variables

```
SPREADSHEET_ID=
GOOGLE_PROJECT_ID=
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
```

Untuk lokal, isi di `.env.local` (bisa ditarik dengan `vercel env pull .env.local`).

## Menjalankan Secara Lokal

```bash
npm install
npm run dev        # http://localhost:3000
```

Build produksi:

```bash
npm run build
npm run preview
```

## Load Test

```bash
k6 run test/stress.js
```

## Deployment

Push ke GitHub, Vercel otomatis build dengan preset Nuxt (`vercel.json`).
