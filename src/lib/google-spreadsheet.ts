import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

const privateKey = process.env.GOOGLE_PRIVATE_KEY ?? '';
const googleSheetID = process.env.GOOGLE_SHEET_ID ?? '';

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: privateKey.split(String.raw`\n`).join('\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const doc = new GoogleSpreadsheet(googleSheetID, serviceAccountAuth);
