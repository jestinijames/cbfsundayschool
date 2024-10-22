/* eslint-disable no-console */
'use server';

import { google } from 'googleapis';

export interface Totals {
  teachers: number;
  students: number;
  classes: number;
}

interface DashboardTotalResponse {
  success: boolean;
  error?: string;
  totals?: Totals;
}

export const getDashboardTotals = async (): Promise<DashboardTotalResponse> => {
  try {
    const auth = await google.auth.getClient({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch teachers
    const teachersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'assignments!B2:E', // Fetch the teacher column
    });

    const teacherRows = teachersResponse.data.values;
    const activeTeachers = teacherRows?.filter((row) => row[3] === 't');
    const teacherCount = activeTeachers?.length || 0;

    // Fetch students
    const studentsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'students!A2:I', // Fetch the student id column
    });

    const studentRows = studentsResponse.data.values;
    const activeStudents = studentRows?.filter((row) => row[8] === 't');
    const studentCount = activeStudents?.length || 0;

    // Fetch classes
    const classesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'classes!A2:A', // Fetch the class id column
    });

    const classRows = classesResponse.data.values;
    const classCount = classRows?.length || 0;

    return {
      success: true,
      totals: {
        teachers: teacherCount,
        students: studentCount,
        classes: classCount,
      },
    };
  } catch (error) {
    console.error('Error reading data:', error);
    return {
      success: false,
      error: `Failed to read data : ${error}`,
    };
  }
};
