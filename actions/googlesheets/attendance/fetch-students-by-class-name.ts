'use server';

import { google } from 'googleapis';

export interface StudentData {
  label: string;
  value: string;
}

interface FetchStudentsByClassNameResponse {
  success: boolean;
  error?: string;
  data?: StudentData[];
}

// Function to capitalize the first letter of each word in a string
const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const fetchStudentsByClassName = async (
  className: string
): Promise<FetchStudentsByClassNameResponse> => {
  try {
    // Capitalize the first letter of each word in the teacher's name
    const formattedClassName = capitalizeWords(className);

    const auth = await google.auth.getClient({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch class id from classes sheet by class name

    const classesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'classes!A2:B',
    });

    const classRows = classesResponse.data.values;

    if (!classRows || classRows.length === 0) {
      return {
        success: false,
        error: 'No data found in classes sheet',
      };
    }

    const classData = classRows.find((row) => row[1] === formattedClassName);

    if (!classData) {
      return {
        success: false,
        error: 'Class not found in classes sheet',
      };
    }

    const classId = classData[0];

    const studentsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'students!A2:I', // Fetching until 'active' field (column I)
    });

    const studentRows = studentsResponse.data.values;

    if (!studentRows || studentRows.length === 0) {
      return {
        success: false,
        error: 'No data found in students sheet',
      };
    }

    const studentsInClass = studentRows
      .filter((row) => row[2] === classId && row[8] === 't') // 'row[8]' is the 'active' column
      .map((row) => ({ label: row[1], value: row[1] }));

    if (studentsInClass.length === 0) {
      return {
        success: false,
        error: 'No students found for the given class name',
      };
    }

    return {
      success: true,
      data: studentsInClass,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch students data: ${error}`,
    };
  }
};
