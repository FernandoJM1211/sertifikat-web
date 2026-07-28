const {
  SPREADSHEET_ID,
  getSheetsService,
} = require("./google");

const cache = require("../cache/cacheManager");

const CACHE_DURATION = 5 * 60 * 1000;

async function getKegiatan() {

  // Cache masih berlaku
  if (
    cache.kegiatan &&
    Date.now() - cache.kegiatanTime < CACHE_DURATION
  ) {
    console.log("✅ Kegiatan dari CACHE");
    return cache.kegiatan;
  }

  // Kalau sedang ada request lain yang membuat cache
  if (cache.kegiatanLoading) {
    console.log("⏳ Menunggu cache kegiatan...");
    return cache.kegiatanLoading;
  }

  // Hanya SATU request yang boleh membuat cache
  cache.kegiatanLoading = (async () => {

    console.log("📄 Mengambil kegiatan dari Google Sheets...");

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

    cache.kegiatan = data;
    cache.kegiatanTime = Date.now();

    return data;

  })();

  try {

    return await cache.kegiatanLoading;

  } finally {

    cache.kegiatanLoading = null;

  }

}

module.exports = {
  getKegiatan,
};