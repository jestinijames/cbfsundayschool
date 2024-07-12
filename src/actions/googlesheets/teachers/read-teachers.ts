/* eslint-disable no-console */
'use server';

import { google } from 'googleapis';

export interface TeacherData {
  id: string;
  name: string;
}

interface ReadAllTeachersResponse {
  success: boolean;
  error?: string;
  data: TeacherData[];
}

export const readAllTeachers = async (): Promise<ReadAllTeachersResponse> => {
  try {
    const auth = await google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'assignments!A2:B',
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return {
        success: false,
        error: 'No data found',
        data: [],
      };
    }

    const data: TeacherData[] = rows.map((row) => ({
      id: row[0],
      name: row[1],
    }));

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
