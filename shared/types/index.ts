/** Satu baris pada sheet "Kegiatan". */
export interface Kegiatan {
  status: string;
  kode: string;
  nama: string;
  flyer: string;
  tanggal: string;
  waktu: string;
  waktuSelesai: string;
  deskripsi: string;
  zoom: string;
  youtube: string;
  virtualBackground: string;
  presensi: string;
  files: string;
}

/** Data ringkas untuk kartu di beranda. */
export type KegiatanRingkas = Pick<
  Kegiatan,
  "kode" | "nama" | "flyer" | "tanggal" | "waktu" | "waktuSelesai" | "status"
>;

/** Satu baris peserta pada sheet per kegiatan (nama sheet = kode kegiatan). */
export interface Sertifikat {
  nama: string;
  instansi: string;
  kegiatan: string;
  sertifikat: string;
  sheet: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  total?: number;
  data?: T;
}
