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
      range: 'students!A1:I', // Fetch data from columns A to I (including 'active' field)
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
    const activeIndex = header.findIndex((col) => col === 'active');
    const nameIndex = header.findIndex((col) => col === 'name');

    // Validate that 'active' and 'name' columns exist
    if (activeIndex === -1 || nameIndex === -1) {
      return {
        success: false,
        error: "'active' or 'name' column not found in the sheet",
        data: [],
      };
    }

    // Filter active students (ignore header row)
    const activeStudents = rows
      .slice(1)
      .filter((row) => row[activeIndex] === 't');

    if (activeStudents.length === 0) {
      return {
        success: false,
        error: 'No active students found',
        data: [],
      };
    }

    // Map active students to { label, value } format using the 'name' field
    const data: StudentData[] = activeStudents.map((row) => ({
      label: row[nameIndex], // Use name for label
      value: row[nameIndex], // Use name for value (or ID if needed)
    }));

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to read students: ${error}`,
      data: [],
    };
  }
};
