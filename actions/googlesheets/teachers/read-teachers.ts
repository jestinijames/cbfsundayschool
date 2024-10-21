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
    const teacherIndex = header.indexOf('teacher');
    const activeIndex = header.indexOf('active');

    if (teacherIndex === -1 || activeIndex === -1) {
      return {
        success: false,
        error: 'Required fields not found in the spreadsheet',
        data: [],
      };
    }

    const data: TeacherData[] = rows
      .slice(1)
      .filter((row) => row[activeIndex] === 't') // Filter only active teachers
      .map((row) => ({
        label: row[teacherIndex],
        value: row[teacherIndex],
      }));

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
