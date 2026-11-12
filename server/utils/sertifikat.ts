import type { Sertifikat } from "#shared/types";

/**
 * Mengambil data peserta dari seluruh sheet selain "Kegiatan" (dengan cache).
 * Setiap sheet mewakili satu kegiatan, nama sheet = kode kegiatan.
 */
export async function loadCertificates(
  forceRefresh = false,
): Promise<Sertifikat[]> {
  if (
    !forceRefresh &&
    cache.sertifikat &&
    Date.now() - cache.sertifikatTime < CACHE_DURATION
  ) {
    return cache.sertifikat;
  }

  if (!forceRefresh && cache.sertifikatLoading) {
    return cache.sertifikatLoading;
  }

  cache.sertifikatLoading = (async () => {
    const sheets = await getSheetsService();
    const spreadsheetId = getSpreadsheetId();

    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });

    const sheetList = (spreadsheet.data.sheets || [])
      .map((sheet) => sheet.properties?.title || "")
      .filter((title) => title && title !== "Kegiatan");

    const responses = await Promise.all(
      sheetList.map((title) =>
        sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${title}!A:Z`,
        }),
      ),
    );

    const allCertificates: Sertifikat[] = [];

    responses.forEach((response, index) => {
      const title = sheetList[index]!;
      const rows = (response.data.values || []) as string[][];

      if (rows.length < 2) return;

      rows.slice(1).forEach((row) => {
        allCertificates.push({
          nama: row[0] || "",
          instansi: row[1] || "",
          kegiatan: row[2] || "",
          sertifikat: row[3] || "",
          sheet: title,
        });
      });
    });

    console.log(
      `Cache sertifikat dibuat (${allCertificates.length} sertifikat)`,
    );

    cache.sertifikat = allCertificates;
    cache.sertifikatTime = Date.now();
    cache.sertifikatCount = allCertificates.length;

    return allCertificates;
  })();

  try {
    return await cache.sertifikatLoading;
  } finally {
    cache.sertifikatLoading = null;
  }
}

/** Mencari peserta berdasarkan potongan nama di dalam satu kegiatan. */
export async function searchCertificates(keyword: string, kode: string) {
  const keywordLower = keyword.toLowerCase().trim();
  const data = await loadCertificates();

  return data.filter(
    (item) =>
      item.sheet === kode && item.nama.toLowerCase().includes(keywordLower),
  );
}
