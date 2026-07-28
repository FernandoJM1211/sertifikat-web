const { loadCertificates } = require("../services/sertifikat");
const { getKegiatan } = require("../services/kegiatan");

module.exports = async (req, res) => {
  try {

    console.log("START REFRESH");

    const sertifikat = await loadCertificates(true);
    console.log("SERTIFIKAT OK", sertifikat.length);

    const kegiatan = await getKegiatan(true);
    console.log("KEGIATAN OK");

    return res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack
    });

  }
};