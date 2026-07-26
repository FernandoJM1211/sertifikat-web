const { GoogleAuth } = require("google-auth-library");
const { google } = require("googleapis");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const auth = new GoogleAuth({
  credentials: {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
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