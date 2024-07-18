/* eslint-disable no-console */
'use server';

import { google } from 'googleapis';

interface DashboardTotalResponse {
  success: boolean;
  error?: string;
  totals?: {
    teachers: number;
    students: number;
    classes: number;
  };
}

export const getDashboardTotals = async (): Promise<DashboardTotalResponse> => {
  try {
    const auth = await google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch teachers
    const teachersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'assignments!B2:B', // Fetch the teacher column
    });

    const teacherRows = teachersResponse.data.values;
    const uniqueTeachers = new Set(teacherRows?.map((row) => row[0]) || []);
    const teacherCount = uniqueTeachers.size;

    // Fetch students
    const studentsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'students!A2:A', // Fetch the student id column
    });

    const studentRows = studentsResponse.data.values;
    const studentCount = studentRows?.length || 0;

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
      error: 'Failed to read data',
    };
  }
};
