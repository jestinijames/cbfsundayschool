'use server';

import { google } from 'googleapis';

export interface StudentData {
  label: string;
  value: string;
}

interface ReadAllStudentsResponse {
  success: boolean;
  error?: string;
  data: StudentData[];
}

export const readAllStudents = async (): Promise<ReadAllStudentsResponse> => {
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
      range: 'students',
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
    const data: StudentData[] = rows.slice(1).map((row) => {
      const obj: Partial<StudentData> = {};
      header.forEach((key, index) => {
        if (key === 'name') {
          obj.label = row[index];
          obj.value = row[index];
        }
      });
      return obj as StudentData;
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to read students',
      data: [],
    };
  }
};
