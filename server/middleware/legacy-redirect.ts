/**
 * Mengarahkan URL versi lama (HTML statis) ke route Nuxt yang baru,
 * agar tautan/QR code yang sudah tersebar tetap berfungsi.
 *
 *   /pages/kegiatan.html?kode=VPL001 -> /kegiatan/VPL001
 *   /pages/home.html, /index.html    -> /
 */
export default defineEventHandler((event) => {
  const url = getRequestURL(event);

  if (url.pathname === "/pages/kegiatan.html") {
    const kode = url.searchParams.get("kode");
    const target = kode ? `/kegiatan/${encodeURIComponent(kode)}` : "/";
    return sendRedirect(event, target, 301);
  }

  if (url.pathname === "/pages/home.html" || url.pathname === "/index.html") {
    return sendRedirect(event, "/", 301);
  }
});
