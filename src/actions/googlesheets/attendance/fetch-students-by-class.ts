/* eslint-disable no-console */
'use server';

import { google } from 'googleapis';

interface StudentData {
  id: string;
  name: string;
  status: boolean;
}

interface FetchStudentsResponse {
  success: boolean;
  error?: string;
  data?: StudentData[];
}

export const fetchStudentsByClassId = async (
  classId: string,
): Promise<FetchStudentsResponse> => {
  try {
    const auth = await google.auth.getClient({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch students sheet to find the students for the given class ID
    const studentsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'students!A2:H', // Adjust the range according to the columns in your sheet
    });

    const studentRows = studentsResponse.data.values;

    if (!studentRows || studentRows.length === 0) {
      return {
        success: false,
        error: 'No data found in students sheet',
      };
    }

    const students: StudentData[] = studentRows
      .filter((row) => row[2] === classId) // Filter students by class ID
      .map((row) => ({
        id: row[0],
        name: row[1],
        status: false,
      }));

    return {
      success: true,
      data: students,
    };
  } catch (error) {
    console.error('Error fetching students data:', error);
    return {
      success: false,
      error: 'Failed to fetch students data',
    };
  }
};
