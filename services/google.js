const { GoogleAuth } = require("google-auth-library");
const { google } = require("googleapis");

// =========================
// ENVIRONMENT VARIABLES
// =========================
const {
  SPREADSHEET_ID,
  GOOGLE_PROJECT_ID,
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
} = process.env;

// =========================
// VALIDASI ENV
// =========================
const requiredEnv = [
  "SPREADSHEET_ID",
  "GOOGLE_PROJECT_ID",
  "GOOGLE_CLIENT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  throw new Error(
    `Environment Variable belum diset: ${missingEnv.join(", ")}`
  );
}

// =========================
// GOOGLE AUTH
// =========================
const auth = new GoogleAuth({
  credentials: {
    type: "service_account",
    project_id: GOOGLE_PROJECT_ID,
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
  ],
});

// =========================
// SHEETS SERVICE
// =========================
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