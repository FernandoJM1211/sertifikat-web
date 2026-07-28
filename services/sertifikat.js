const {
  SPREADSHEET_ID,
  getSheetsService,
} = require("./google");

const cache = require("../cache/cacheManager");

const CACHE_DURATION = 5 * 60 * 1000;

// =========================
// LOAD SEMUA DATA
// =========================
async function loadCertificates() {

  // =========================
  // CACHE MASIH BERLAKU
  // =========================
  if (
    cache.sertifikat &&
    Date.now() - cache.sertifikatTime < CACHE_DURATION
  ) {
    console.log("✅ Sertifikat dari CACHE");
    return cache.sertifikat;
  }

  // =========================
  // JIKA SEDANG MEMBANGUN CACHE
  // REQUEST LAIN TINGGAL MENUNGGU
  // =========================
  if (cache.sertifikatLoading) {
    console.log("⏳ Menunggu cache selesai dibuat...");
    return cache.sertifikatLoading;
  }

  // =========================
  // HANYA SATU REQUEST YANG
  // MEMBANGUN CACHE
  // =========================
  cache.sertifikatLoading = (async () => {

    console.log("📄 Mengambil data dari Google Sheets...");

    const sheets = await getSheetsService();

    // Ambil daftar sheet
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheetList = spreadsheet.data.sheets
      .map(sheet => sheet.properties.title)
      .filter(title => title !== "Kegiatan");

    // Ambil semua sheet secara paralel
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
          sheet: title,
        });

      });

    });

    console.log(`📦 Cache berhasil dibuat (${allCertificates.length} sertifikat)`);

    // Simpan ke cache
    cache.sertifikat = allCertificates;
    cache.sertifikatTime = Date.now();
    cache.sertifikatCount = allCertificates.length;

    return cache.sertifikat;

  })();

  try {

    return await cache.sertifikatLoading;

  } finally {

    cache.sertifikatLoading = null;

  }

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