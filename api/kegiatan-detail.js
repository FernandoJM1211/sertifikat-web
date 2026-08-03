const {
  getDetailKegiatan,
} = require("../services/kegiatan");

module.exports = async (req, res) => {

  try {

    const { kode } = req.query;

    if (!kode) {

      return res.status(400).json({

        success: false,

        message: "Parameter kode wajib diisi.",

      });

    }

    const kegiatan = await getDetailKegiatan(kode);

    if (!kegiatan) {

      return res.status(404).json({

        success: false,

        message: "Kegiatan tidak ditemukan.",

      });

    }

    res.status(200).json({

      success: true,

      data: kegiatan,

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }

};