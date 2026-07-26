const {
  SPREADSHEET_ID,
  getSheetsService,
} = require("./google");

async function searchCertificates(keyword) {
  const sheets = await getSheetsService();

  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });

  const sheetList = spreadsheet.data.sheets;

  const keywordLower = keyword.toLowerCase().trim();

  const results = [];

  for (const sheet of sheetList) {

    const title = sheet.properties.title;

    if (title === "Kegiatan") continue;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${title}!A:Z`,
    });

    const rows = response.data.values || [];

    if (rows.length < 2) continue;

    const dataRows = rows.slice(1);

    for (const row of dataRows) {

      const nama = (row[0] || "").toLowerCase();

      if (nama.includes(keywordLower)) {

        results.push({
    nama: row[0] || "",
    instansi: row[1] || "",
    kegiatan: row[2] || "",
    sertifikat: row[3] || ""
});

      }

    }

  }

  return results;
}

module.exports = {
  searchCertificates,
};