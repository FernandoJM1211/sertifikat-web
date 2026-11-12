import { auth, sheets } from "@googleapis/sheets";

const REQUIRED_ENV = [
  "SPREADSHEET_ID",
  "GOOGLE_PROJECT_ID",
  "GOOGLE_CLIENT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
] as const;

export function getSpreadsheetId() {
  return process.env.SPREADSHEET_ID as string;
}

/**
 * Membuat client Google Sheets (read-only) dari kredensial service account
 * yang disimpan di Environment Variable.
 */
export async function getSheetsService() {
  const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);

  if (missingEnv.length) {
    throw new Error(
      `Environment Variable belum diset: ${missingEnv.join(", ")}`,
    );
  }

  const googleAuth = new auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  return sheets({ version: "v4", auth: googleAuth });
}
