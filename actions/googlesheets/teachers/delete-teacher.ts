'use server';
import { google } from 'googleapis';

interface Response {
  success: boolean;
  error?: string;
}

export const deleteTeacher = async (id: string): Promise<Response> => {
  try {
    const auth = await google.auth.getClient({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch existing teachers
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'assignments!A2:E',
    });

    const teacherRows = response.data.values || [];

    // Find teacher by ID
    const existingTeacher = teacherRows.find((row) => row[0] === id);
    if (!existingTeacher) {
      return { success: false, error: 'Teacher not found.' };
    }

    // Mark teacher as inactive
    const rowIndex = teacherRows.indexOf(existingTeacher) + 2; // +2 to account for header and 0-based index

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `assignments!E${rowIndex}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [['f']], // Set active status to 'f'
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to delete teacher: ${error}` };
  }
};
