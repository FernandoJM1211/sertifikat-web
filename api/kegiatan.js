const { getKegiatan } = require("../services/kegiatan");

module.exports = async (req, res) => {
  try {
    const data = await getKegiatan();

    res.status(200).json({
      success: true,
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