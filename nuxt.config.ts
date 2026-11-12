export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  devtools: { enabled: false },

  app: {
    head: {
      htmlAttrs: { lang: "id" },
      title: "Portal Kegiatan Direktorat Teknologi dan Digitalisasi Pembelajaran",
      link: [{ rel: "icon", type: "image/png", href: "/images/logo-lan.png" }],
    },
  },

  routeRules: {
    // Header keamanan untuk seluruh halaman, API, dan file statis.
    "/**": {
      headers: {
        // Mencegah browser menebak tipe file (MIME sniffing).
        "X-Content-Type-Options": "nosniff",
        // Mencegah situs ini dimuat di dalam iframe situs lain (clickjacking).
        "X-Frame-Options": "SAMEORIGIN",
        "Content-Security-Policy": "frame-ancestors 'self'",
        // Hanya kirim origin (bukan URL lengkap) ke situs lain.
        "Referrer-Policy": "strict-origin-when-cross-origin",
        // Fitur perangkat yang tidak dipakai portal ini dimatikan.
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      },
    },
  },
});
