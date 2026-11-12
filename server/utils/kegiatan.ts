import type { Kegiatan, KegiatanRingkas } from "#shared/types";

/** Mengambil seluruh baris sheet "Kegiatan" (dengan cache). */
async function loadKegiatan(): Promise<Kegiatan[]> {
  if (cache.kegiatan && Date.now() - cache.kegiatanTime < CACHE_DURATION) {
    return cache.kegiatan;
  }

  if (cache.kegiatanLoading) {
    return cache.kegiatanLoading;
  }

  cache.kegiatanLoading = (async () => {
    const sheets = await getSheetsService();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: getSpreadsheetId(),
      range: "Kegiatan!A:Z",
    });

    const rows = (response.data.values || []) as string[][];

    const data: Kegiatan[] = rows
      .slice(1)
      .map((row) => ({
        status: row[0] || "",
        kode: row[1] || "",
        nama: row[2] || "",
        flyer: row[3] || "",
        tanggal: row[4] || "",
        waktu: row[5] || "",
        waktuSelesai: row[6] || "",
        deskripsi: row[7] || "",
        zoom: row[8] || "",
        youtube: row[9] || "",
        virtualBackground: row[10] || "",
        presensi: row[11] || "",
        files: row[12] || "",
      }))
      .filter((item) => item.kode);

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

/** Kegiatan berstatus "aktif" untuk beranda, urutan terbaru lebih dulu. */
export async function getDaftarKegiatan(): Promise<KegiatanRingkas[]> {
  const data = await loadKegiatan();

  return data
    .filter((item) => String(item.status).trim().toLowerCase() === "aktif")
    .reverse()
    .map((item) => ({
      kode: item.kode,
      nama: item.nama,
      flyer: item.flyer,
      tanggal: item.tanggal,
      waktu: item.waktu,
      waktuSelesai: item.waktuSelesai,
      status: item.status,
    }));
}

/** Detail satu kegiatan berdasarkan kode (tidak peka huruf besar/kecil). */
export async function getDetailKegiatan(kode: string) {
  const data = await loadKegiatan();
  const keyword = String(kode).trim().toUpperCase();

  return data.find(
    (item) => String(item.kode).trim().toUpperCase() === keyword,
  );
}
