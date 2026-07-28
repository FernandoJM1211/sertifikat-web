const cache = require("../cache/cacheManager");

module.exports = async (req, res) => {

  const memory = process.memoryUsage();

  res.status(200).json({

    status: "OK",

    version: cache.version,

    uptime: process.uptime(),

    timestamp: new Date().toISOString(),

    cache: {

      kegiatanLoaded: !!cache.kegiatan,

      sertifikatLoaded: !!cache.sertifikat,

      jumlahSertifikat: cache.sertifikatCount,

      kegiatanLastRefresh: cache.kegiatanTime
        ? new Date(cache.kegiatanTime).toISOString()
        : null,

      sertifikatLastRefresh: cache.sertifikatTime
        ? new Date(cache.sertifikatTime).toISOString()
        : null

    },

    memory: {

      rss: Math.round(memory.rss / 1024 / 1024) + " MB",

      heapUsed: Math.round(memory.heapUsed / 1024 / 1024) + " MB",

      heapTotal: Math.round(memory.heapTotal / 1024 / 1024) + " MB"

    }

  });

};