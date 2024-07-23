'use server';

import { google } from 'googleapis';

export interface ClassData {
  label: string;
  value: string;
}

interface FetchClassByTeacherNameResponse {
  success: boolean;
  error?: string;
  data?: ClassData;
}

// Function to capitalize the first letter of each word in a string
const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const fetchClassByTeacherName = async (
  teacherName: string,
): Promise<FetchClassByTeacherNameResponse> => {
  try {
    // Capitalize the first letter of each word in the teacher's name
    const formattedTeacherName = capitalizeWords(teacherName);

    const auth = await google.auth.getClient({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch assignments sheet to find the class ID for the given teacher name
    const assignmentsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'assignments!A2:C',
    });

    const assignmentRows = assignmentsResponse.data.values;

    if (!assignmentRows || assignmentRows.length === 0) {
      return {
        success: false,
        error: 'No data found in assignments sheet',
      };
    }

    const assignment = assignmentRows.find(
      (row) => row[1] === formattedTeacherName,
    );

    if (!assignment) {
      return {
        success: false,
        error: 'Teacher not found in assignments sheet',
      };
    }

    const classId = assignment[2];

    // Fetch classes sheet to find the class name for the found class ID
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

    const classData = classRows.find((row) => row[0] === classId);

    if (!classData) {
      return {
        success: false,
        error: 'Class not found in classes sheet',
      };
    }

    const classInfo: ClassData = {
      label: classData[1], // name
      value: classData[1], // name
    };

    return {
      success: true,
      data: classInfo,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch class data',
    };
  }
};
