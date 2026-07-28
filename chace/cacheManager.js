// cache/cacheManager.js

module.exports = {
  kegiatan: null,
  kegiatanTime: 0,

  sertifikat: null,
  sertifikatTime: 0,

  // Untuk mencegah cache stampede
  kegiatanLoading: null,
  sertifikatLoading: null,
};