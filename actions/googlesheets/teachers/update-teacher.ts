'use server';
import { google } from 'googleapis';

export interface UpdateTeacherData {
  id: string;
  name: string;
  classId: string;
  email: string;
}

interface Response {
  success: boolean;
  error?: string;
}

export const updateTeacher = async (
  teacherData: UpdateTeacherData
): Promise<Response> => {
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
    const existingTeacher = teacherRows.find(
      (row) => row[0] === teacherData.id
    );
    if (!existingTeacher) {
      return { success: false, error: 'Teacher not found.' };
    }

    // Check for name and email duplicates
    const nameExists = teacherRows.some(
      (row) => row[1] === teacherData.name && row[0] !== teacherData.id
    );
    const emailExists = teacherRows.some(
      (row) => row[3] === teacherData.email && row[0] !== teacherData.id
    );
    if (nameExists) {
      return { success: false, error: 'Teacher name already exists.' };
    }
    if (emailExists) {
      return { success: false, error: 'Email already exists.' };
    }

    // Update teacher fields
    const rowIndex = teacherRows.indexOf(existingTeacher) + 2; // +2 to account for header and 0-based index
    const updatedFields = [
      [`assignments!B${rowIndex}`, teacherData.name],
      [`assignments!C${rowIndex}`, teacherData.classId],
      [`assignments!D${rowIndex}`, teacherData.email],
    ];

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      requestBody: {
        data: updatedFields.map(([range, value]) => ({
          range,
          majorDimension: 'ROWS',
          values: [[value]],
        })),
        valueInputOption: 'RAW',
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to update teacher: ${error}` };
  }
};
