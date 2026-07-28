const {
  SPREADSHEET_ID,
  getSheetsService,
} = require("./google");

// Cache
let cache = null;
let cacheTime = 0;

// 5 menit
const CACHE_DURATION = 5 * 60 * 1000;

async function getKegiatan() {

  // Kalau cache masih berlaku
  if (cache && Date.now() - cacheTime < CACHE_DURATION) {
    console.log("✅ Data dari CACHE");
    return cache;
  }

  console.log("📄 Ambil dari Google Sheets");

  const sheets = await getSheetsService();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Kegiatan!A:J",
  });

  const rows = response.data.values || [];

  if (rows.length < 2) {
    return null;
  }

  const data = {
    nama: rows[1][0] || "",
    flyer: rows[1][1] || "",
    tanggal: rows[1][2] || "",
    waktu: rows[1][3] || "",
    deskripsi: rows[1][4] || "",
    zoom: rows[1][5] || "",
    youtube: rows[1][6] || "",
    virtualBackground: rows[1][7] || "",
    presensi: rows[1][8] || "",
    files: rows[1][9] || "",
  };

  // Simpan cache
  cache = data;
  cacheTime = Date.now();

  return data;
}

module.exports = {
  getKegiatan,
};