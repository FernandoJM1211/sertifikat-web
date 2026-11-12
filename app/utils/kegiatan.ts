/*
=====================================================
UTILITAS KEGIATAN
Dipakai bersama oleh beranda dan halaman detail.
=====================================================
*/

export const LOGO_URL = "/images/logo-lan.png";

/** Offset WIB (Asia/Jakarta, UTC+7, tanpa daylight saving). */
const WIB_OFFSET = 7 * 60 * 60 * 1000;

const POLA_TANGGAL = /^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/;
const POLA_WAKTU = /^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i;

export interface StatusKegiatan {
  text: string;
  className: "status-finished" | "status-coming" | "status-today";
}

interface TanggalLokal {
  year: number;
  month: number;
  day: number;
}

/** Tanggal dari spreadsheet (DD/MM/YYYY atau DD/MM/YY). */
function parseTanggal(tanggal: string): TanggalLokal | null {
  const text = String(tanggal).trim();
  const match = text.match(POLA_TANGGAL);

  if (match) {
    let year = Number(match[3]);
    if (match[3]!.length === 2) year += 2000;
    return { year, month: Number(match[2]) - 1, day: Number(match[1]) };
  }

  const fallback = new Date(text);
  if (Number.isNaN(fallback.getTime())) return null;

  return {
    year: fallback.getFullYear(),
    month: fallback.getMonth(),
    day: fallback.getDate(),
  };
}

/** Jam dari spreadsheet ("9:00:00 AM") menjadi { hour, minute } 24 jam. */
function parseWaktu(waktu: string) {
  const match = String(waktu).trim().match(POLA_WAKTU);
  if (!match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3]!.toUpperCase();

  if (period === "AM") {
    if (hour === 12) hour = 0;
  } else if (hour !== 12) {
    hour += 12;
  }

  return { hour, minute };
}

/** Timestamp (ms) dari tanggal + jam WIB. */
function waktuWIB(tgl: TanggalLokal, hour = 0, minute = 0) {
  return Date.UTC(tgl.year, tgl.month, tgl.day, hour, minute) - WIB_OFFSET;
}

/**
 * Status kegiatan berdasarkan tanggal dan jam pelaksanaan (WIB),
 * sehingga hasilnya sama di server maupun di browser zona waktu mana pun.
 */
export function getStatusKegiatan(
  tanggal: string,
  waktuMulai: string,
  waktuSelesai: string,
  now = Date.now(),
): StatusKegiatan {
  const selesai: StatusKegiatan = { text: "Selesai", className: "status-finished" };
  const akanDatang: StatusKegiatan = { text: "Akan Datang", className: "status-coming" };

  if (!tanggal) {
    return { text: "-", className: "status-finished" };
  }

  const tgl = parseTanggal(tanggal);

  if (!tgl) {
    return { text: "-", className: "status-finished" };
  }

  // Tanggal hari ini menurut WIB
  const sekarangWIB = new Date(now + WIB_OFFSET);
  const hariIni = Date.UTC(
    sekarangWIB.getUTCFullYear(),
    sekarangWIB.getUTCMonth(),
    sekarangWIB.getUTCDate(),
  );
  const hariKegiatan = Date.UTC(tgl.year, tgl.month, tgl.day);

  if (hariKegiatan < hariIni) return selesai;
  if (hariKegiatan > hariIni) return akanDatang;

  // Tanggal sama dengan hari ini
  if (!waktuMulai || !waktuSelesai) {
    return { text: "Hari ini", className: "status-today" };
  }

  const mulai = parseWaktu(waktuMulai);
  const akhir = parseWaktu(waktuSelesai);

  const mulaiMs = waktuWIB(tgl, mulai?.hour, mulai?.minute);
  const akhirMs = waktuWIB(tgl, akhir?.hour, akhir?.minute);

  if (now < mulaiMs) return akanDatang;
  if (now >= akhirMs) return selesai;

  return { text: "Sedang Berlangsung", className: "status-today" };
}

/** Menyeragamkan tanggal menjadi DD/MM/YYYY. */
export function formatTanggal(tanggal: string) {
  if (!tanggal) return "-";

  const text = String(tanggal).trim();
  const match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (match) {
    return `${match[1]!.padStart(2, "0")}/${match[2]!.padStart(2, "0")}/${match[3]}`;
  }

  return text;
}

/** "1:30:00 PM" -> "13.30". */
export function formatWaktu(waktu: string) {
  if (!waktu) return "";

  const parsed = parseWaktu(waktu);
  if (!parsed) return String(waktu).trim();

  const jam = String(parsed.hour).padStart(2, "0");
  const menit = String(parsed.minute).padStart(2, "0");

  return `${jam}.${menit}`;
}

/** "09.00 – 11.00 WIB". */
export function formatRentangWaktu(waktuMulai: string, waktuSelesai: string) {
  const mulai = formatWaktu(waktuMulai);
  const selesai = formatWaktu(waktuSelesai);

  if (mulai && selesai) return `${mulai} – ${selesai} WIB`;
  if (mulai) return `${mulai} WIB`;
  if (selesai) return `${selesai} WIB`;

  return "-";
}
