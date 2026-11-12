import type { H3Event } from "h3";

/** Mengirim respons gagal dengan format yang sama seperti API versi lama. */
export function sendFail(event: H3Event, status: number, message: string) {
  setResponseStatus(event, status);
  return { success: false, message };
}

/**
 * Membungkus handler agar error tak terduga dikembalikan sebagai 500.
 * Detail error hanya dicatat di log server, tidak dikirim ke pengguna,
 * karena bisa memuat informasi internal (nama env, ID spreadsheet, dll).
 */
export function defineApiHandler<T>(handler: (event: H3Event) => Promise<T>) {
  return defineEventHandler(async (event) => {
    try {
      return await handler(event);
    } catch (err) {
      console.error(err);
      return sendFail(event, 500, "Terjadi kesalahan pada server.");
    }
  });
}
