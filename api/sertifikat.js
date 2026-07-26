const { searchCertificates } = require("../services/sertifikat");

module.exports = async (req, res) => {

    try {

        const keyword = req.query.keyword || "";

        if (!keyword.trim()) {

            return res.status(400).json({
                success: false,
                message: "Keyword wajib diisi."
            });

        }

        const data = await searchCertificates(keyword);

        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};