import type { Kegiatan, Sertifikat } from "#shared/types";

/** Lama data spreadsheet disimpan di memori sebelum diambil ulang. */
export const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Cache di memori instance server.
 * Field *Loading menampung Promise yang sedang berjalan agar request
 * bersamaan cukup menunggu satu kali pengambilan ke Google Sheets.
 */
export const cache = {
  kegiatan: null as Kegiatan[] | null,
  kegiatanTime: 0,
  kegiatanLoading: null as Promise<Kegiatan[]> | null,

  sertifikat: null as Sertifikat[] | null,
  sertifikatTime: 0,
  sertifikatCount: 0,
  sertifikatLoading: null as Promise<Sertifikat[]> | null,

  version: "2.0.0",
  buildTime: new Date().toISOString(),
};
