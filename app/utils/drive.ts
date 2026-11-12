/*
=====================================================
LINK DARI SPREADSHEET
=====================================================
*/

/**
 * Hanya meloloskan URL http/https. Vue tidak menyaring atribut href/src,
 * sehingga nilai seperti "javascript:..." dari spreadsheet harus ditolak
 * agar tidak bisa menjalankan skrip (XSS).
 */
export function safeUrl(url?: string) {
  if (!url) return "";

  const text = String(url).trim();

  try {
    const { protocol } = new URL(text);
    return protocol === "https:" || protocol === "http:" ? text : "";
  } catch {
    return "";
  }
}

/*
=====================================================
KONVERSI LINK GOOGLE DRIVE
Mendukung format:
  https://drive.google.com/file/d/FILE_ID/view
  https://drive.google.com/open?id=FILE_ID
=====================================================
*/

function getDriveId(link: string) {
  const text = String(link).trim();

  return (
    text.match(/\/d\/([\w-]+)/)?.[1] || text.match(/[?&]id=([\w-]+)/)?.[1] || ""
  );
}

/** Link Drive -> URL gambar thumbnail (untuk <img>). */
export function driveThumbnail(link?: string) {
  if (!link) return "";

  const id = getDriveId(link);

  return id
    ? `https://drive.google.com/thumbnail?id=${id}&sz=w1000`
    : safeUrl(link);
}

/** Link Drive -> URL unduh langsung. */
export function driveDownload(link?: string) {
  if (!link) return "";

  const id = getDriveId(link);

  return id
    ? `https://drive.google.com/uc?export=download&id=${id}`
    : safeUrl(link);
}

/**
 * Atribut untuk tautan yang bisa kosong: jika URL kosong atau tidak aman,
 * href dihapus dan tautan diberi kelas "disabled".
 */
export function linkAttrs(url?: string) {
  const href = safeUrl(url);

  return {
    href: href || undefined,
    class: { disabled: !href },
    "aria-disabled": href ? undefined : ("true" as const),
  };
}
