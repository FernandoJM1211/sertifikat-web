const { GoogleAuth } = require("google-auth-library");
const { google } = require("googleapis");

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function getSheetsService() {

  const requiredEnv = [
    "SPREADSHEET_ID",
    "GOOGLE_PROJECT_ID",
    "GOOGLE_CLIENT_EMAIL",
    "GOOGLE_PRIVATE_KEY",
  ];

  const missingEnv = requiredEnv.filter(
    (key) => !process.env[key]
  );

  if (missingEnv.length) {
    throw new Error(
      `Environment Variable belum diset: ${missingEnv.join(", ")}`
    );
  }

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