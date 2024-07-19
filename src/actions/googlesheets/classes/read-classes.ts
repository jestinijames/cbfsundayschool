/* eslint-disable no-console */
'use server';

import { google } from 'googleapis';

export interface ClassData {
  id: string;
  name: string;
}

interface ReadAllClassesResponse {
  success: boolean;
  error?: string;
  data: ClassData[];
}

export const readAllClasses = async (): Promise<ReadAllClassesResponse> => {
  try {
    const auth = await google.auth.getClient({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'classes',
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return {
        success: false,
        error: 'No data found',
        data: [],
      };
    }

    // Assuming the first row is the header
    const header = rows[0];
    const data: ClassData[] = rows.slice(1).map((row) => {
      const obj: Partial<ClassData> = {};
      header.forEach((key, index) => {
        obj[key as keyof ClassData] = row[index];
      });
      return obj as ClassData;
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error reading classes:', error);
    return {
      success: false,
      error: 'Failed to read classes',
      data: [],
    };
  }
};
