const { GoogleAuth } = require("google-auth-library");
const { google } = require("googleapis");

const SPREADSHEET_ID = "1FfxFZPRn8J5oLCBzPrJlei4yMdlj18_dq0YGats6G7g";

const auth = new GoogleAuth({
  keyFile: "./credentials/service-account.json",
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
  ],
});

async function getSheetsService() {
  const client = await auth.getClient();

  return google.sheets({
    version: "v4",
    auth: client,
  });
}

module.exports = {
  SPREADSHEET_ID,
  getSheetsService,
};