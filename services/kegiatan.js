const {
  SPREADSHEET_ID,
  getSheetsService,
} = require("./google");

async function getKegiatan() {
  const sheets = await getSheetsService();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Kegiatan!A:J",
  });

  const rows = response.data.values || [];

  if (rows.length < 2) {
    return null;
  }

  const data = rows[1];

  return {
    nama: data[0] || "",
    flyer: data[1] || "",
    tanggal: data[2] || "",
    waktu: data[3] || "",
    deskripsi: data[4] || "",
    zoom: data[5] || "",
    youtube: data[6] || "",
    virtualBackground: data[7] || "",
    presensi: data[8] || "",
    files: data[9] || "",
  };
}

module.exports = {
  getKegiatan,
};