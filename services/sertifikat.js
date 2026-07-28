const {
  SPREADSHEET_ID,
  getSheetsService,
} = require("./google");

// =========================
// CACHE
// =========================
let certificateCache = null;
let cacheTime = 0;

const CACHE_DURATION = 5 * 60 * 1000;

// =========================
// LOAD SEMUA DATA
// =========================
async function loadCertificates() {

  if (
    certificateCache &&
    Date.now() - cacheTime < CACHE_DURATION
  ) {
    console.log("✅ Sertifikat dari CACHE");
    return certificateCache;
  }

  console.log("📄 Mengambil data dari Google Sheets...");

  const sheets = await getSheetsService();

  // Ambil daftar sheet
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });

  const sheetList = spreadsheet.data.sheets
    .map(sheet => sheet.properties.title)
    .filter(title => title !== "Kegiatan");

  // =========================
  // LOAD SEMUA SHEET SECARA PARALEL
  // =========================

  const responses = await Promise.all(

    sheetList.map(title =>

      sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${title}!A:Z`,
      })

    )

  );

  const allCertificates = [];

  responses.forEach((response, index) => {

    const title = sheetList[index];

    const rows = response.data.values || [];

    if (rows.length < 2) return;

    rows.slice(1).forEach(row => {

      allCertificates.push({
        nama: row[0] || "",
        instansi: row[1] || "",
        kegiatan: row[2] || "",
        sertifikat: row[3] || "",
        sheet: title
      });

    });

  });

  console.log(`📦 Cache berhasil dibuat (${allCertificates.length} sertifikat)`);

  certificateCache = allCertificates;
  cacheTime = Date.now();

  return certificateCache;

}

// =========================
// SEARCH
// =========================

async function searchCertificates(keyword) {

  const keywordLower = keyword
    .toLowerCase()
    .trim();

  const data = await loadCertificates();

  return data.filter(item =>
    item.nama.toLowerCase().includes(keywordLower)
  );

}

module.exports = {
  searchCertificates,
};