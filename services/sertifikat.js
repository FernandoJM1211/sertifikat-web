const {
  SPREADSHEET_ID,
  getSheetsService,
} = require("./google");

// =========================
// CACHE
// =========================
let certificateCache = null;
let cacheTime = 0;

// Cache 5 menit
const CACHE_DURATION = 5 * 60 * 1000;

// =========================
// LOAD SEMUA SERTIFIKAT
// =========================
async function loadCertificates() {

  // Jika cache masih berlaku
  if (
    certificateCache &&
    Date.now() - cacheTime < CACHE_DURATION
  ) {
    console.log("✅ Sertifikat dari CACHE");
    return certificateCache;
  }

  console.log("📄 Mengambil data sertifikat dari Google Sheets...");

  const sheets = await getSheetsService();

  // Ambil daftar sheet
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });

  const sheetList = spreadsheet.data.sheets;

  const allCertificates = [];

  // Loop semua sheet
  for (const sheet of sheetList) {

    const title = sheet.properties.title;

    // Skip sheet kegiatan
    if (title === "Kegiatan") continue;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${title}!A:Z`,
    });

    const rows = response.data.values || [];

    if (rows.length < 2) continue;

    // Skip header
    for (const row of rows.slice(1)) {

      allCertificates.push({
        nama: row[0] || "",
        instansi: row[1] || "",
        kegiatan: row[2] || "",
        sertifikat: row[3] || "",
      });

    }

  }

  console.log(`📦 Total sertifikat dimuat: ${allCertificates.length}`);

  // Simpan ke cache
  certificateCache = allCertificates;
  cacheTime = Date.now();

  return allCertificates;
}

// =========================
// SEARCH
// =========================
async function searchCertificates(keyword) {

  const keywordLower = keyword.toLowerCase().trim();

  const data = await loadCertificates();

  return data.filter(item =>
    item.nama.toLowerCase().includes(keywordLower)
  );

}

module.exports = {
  searchCertificates,
};