/**
 * Batas input pencarian sertifikat, dipakai bersama oleh halaman dan API.
 * Panjang minimal mencegah pencarian 1–2 huruf yang menampilkan hampir
 * seluruh data peserta (nama dan instansi) sekaligus.
 */
export const KEYWORD_MIN = 3;
export const KEYWORD_MAX = 100;
export const KODE_MAX = 50;
