/* eslint-disable no-console */
'use server';
import { google } from 'googleapis';

export const deleteStudent = async (studentId: string) => {
  try {
    const auth = await google.auth.getClient({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const studentsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'students!A2:I',
    });

    const students = studentsResponse.data.values;
    if (!students) {
      return { success: false, error: 'No students found' };
    }

    const studentIndex = students.findIndex((row) => row[0] === studentId);
    if (studentIndex === -1) {
      return { success: false, error: 'Student not found' };
    }

    // Mark the student as inactive
    students[studentIndex][8] = 'f';

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `students!A${studentIndex + 2}:I${studentIndex + 2}`,
      valueInputOption: 'RAW',
      requestBody: { values: [students[studentIndex]] },
    });

    return { success: true, message: 'Student marked as inactive' };
  } catch (error) {
    return { success: false, error: `Failed to delete student: ${error}` };
  }
};
