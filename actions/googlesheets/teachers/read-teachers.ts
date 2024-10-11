'use server';

import { google } from 'googleapis';

export interface TeacherData {
  label: string;
  value: string;
}

interface ReadAllTeachersResponse {
  success: boolean;
  error?: string;
  data: TeacherData[];
}

export const readAllTeachers = async (): Promise<ReadAllTeachersResponse> => {
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
      range: 'assignments',
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
    const data: TeacherData[] = rows.slice(1).map((row) => {
      const obj: Partial<TeacherData> = {};
      header.forEach((key, index) => {
        if (key === 'teacher') {
          obj.label = row[index];
          obj.value = row[index];
        }
      });
      return obj as TeacherData;
    });

    // Sort the data by the 'label' property in ascending order
    data.sort((a, b) => a.label.localeCompare(b.label));

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to read teachers',
      data: [],
    };
  }
};
