const {
  SPREADSHEET_ID,
  getSheetsService,
} = require("./google");

const cache = require("../cache/cacheManager");

const CACHE_DURATION = 5 * 60 * 1000;

/*
=========================================
LOAD SELURUH DATA KEGIATAN
=========================================
*/

async function loadKegiatan() {

  if (
    cache.kegiatan &&
    Date.now() - cache.kegiatanTime < CACHE_DURATION
  ) {
    return cache.kegiatan;
  }

  if (cache.kegiatanLoading) {
    return cache.kegiatanLoading;
  }

  cache.kegiatanLoading = (async () => {

    const sheets = await getSheetsService();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Kegiatan!A:Z",
    });

    const rows = response.data.values || [];

    if (rows.length < 2) {

      cache.kegiatan = [];
      cache.kegiatanTime = Date.now();

      return [];

    }

    const data = rows
      .slice(1)
      .map(row => ({

        status: row[0] || "",
        kode: row[1] || "",
        nama: row[2] || "",
        flyer: row[3] || "",
        tanggal: row[4] || "",
        waktu: row[5] || "",
        deskripsi: row[6] || "",
        zoom: row[7] || "",
        youtube: row[8] || "",
        virtualBackground: row[9] || "",
        presensi: row[10] || "",
        files: row[11] || "",

      }))
      .filter(item => item.kode);

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

/*
=========================================
UNTUK HOMEPAGE
=========================================
*/

async function getDaftarKegiatan() {

  const data = await loadKegiatan();

  return data
    .filter(item =>
      String(item.status)
        .trim()
        .toLowerCase() === "aktif"
    )

      .reverse()
      
    .map(item => ({

      kode: item.kode,
      nama: item.nama,
      flyer: item.flyer,
      tanggal: item.tanggal,
      status: item.status

    }));

}

/*
=========================================
UNTUK HALAMAN KEGIATAN
=========================================
*/

async function getDetailKegiatan(kode) {

  const data = await loadKegiatan();

  const keyword = String(kode)
    .trim()
    .toUpperCase();

  return data.find(item =>
    String(item.kode)
      .trim()
      .toUpperCase() === keyword
  );

}

module.exports = {

  getDaftarKegiatan,
  getDetailKegiatan,

};