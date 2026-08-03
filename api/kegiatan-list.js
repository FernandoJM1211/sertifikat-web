const {
  getDaftarKegiatan,
} = require("../services/kegiatan");

module.exports = async (req, res) => {

  try {

    const data = await getDaftarKegiatan();

    res.status(200).json({

      success: true,

      total: data.length,

      data,

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }

};