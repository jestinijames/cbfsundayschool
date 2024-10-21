'use server';
import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';

export interface CreateTeacherData {
  name: string;
  classId: string;
  email: string;
}

interface Response {
  success: boolean;
  error?: string;
}

export const createTeacher = async (
  teacherData: CreateTeacherData
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
      range: 'assignments!A2:D',
    });

    const teacherRows = response.data.values || [];

    // Check if teacher already exists
    const existingTeacher = teacherRows.find(
      (row) => row[1] === teacherData.name
    );
    if (existingTeacher) {
      return {
        success: false,
        error: `Teacher ${teacherData.name} already exists.`,
      };
    }

    // Create new teacher
    const newTeacher = [
      uuidv4(),
      teacherData.name,
      teacherData.classId,
      teacherData.email || '',
      't', // active status
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'assignments!A:E',
      valueInputOption: 'RAW',
      requestBody: {
        values: [newTeacher],
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to create teacher: ${error}` };
  }
};
