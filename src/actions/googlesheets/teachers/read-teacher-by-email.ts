'use server';

import { google } from 'googleapis';

interface ReadTeacherByEmailResponse {
  success: boolean;
  error?: string;
  teacherName?: string;
}

export const readTeacherByEmail = async (
  emailId: string,
): Promise<ReadTeacherByEmailResponse> => {
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
      };
    }

    const header = rows[0];
    const emailIndex = header.indexOf('email_id');
    const teacherIndex = header.indexOf('teacher');

    if (emailIndex === -1 || teacherIndex === -1) {
      return {
        success: false,
        error: 'Required columns not found',
      };
    }

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[emailIndex] === emailId) {
        return {
          success: true,
          teacherName: row[teacherIndex],
        };
      }
    }

    return {
      success: false,
      error: 'Teacher not found',
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to search for teacher',
    };
  }
};
