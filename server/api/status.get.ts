const toMB = (bytes: number) => Math.round(bytes / 1024 / 1024) + " MB";

const toISO = (time: number) => (time ? new Date(time).toISOString() : null);

export default defineEventHandler(() => {
  const memory = process.memoryUsage();

  return {
    status: "OK",
    version: cache.version,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    cache: {
      kegiatanLoaded: !!cache.kegiatan,
      sertifikatLoaded: !!cache.sertifikat,
      jumlahSertifikat: cache.sertifikatCount,
      kegiatanLastRefresh: toISO(cache.kegiatanTime),
      sertifikatLastRefresh: toISO(cache.sertifikatTime),
    },
    memory: {
      rss: toMB(memory.rss),
      heapUsed: toMB(memory.heapUsed),
      heapTotal: toMB(memory.heapTotal),
    },
  };
});
