'use server';

import { google } from 'googleapis';

export default async function getAllClasses() {
  try {
    //await doc.loadInfo();

    const auth = await google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // const sheet = doc.sheetsByIndex[0];
    // const rows = await sheet.getRows();

    const sheets = google.sheets({
      version: 'v4',
      auth,
    });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'classes',
    });

    return {
      rows: response.data.values,
    };
  } catch (error) {
    console.error('something went wrong', error);
    return {
      total: 0,
      results: [],
    };
  }
}
