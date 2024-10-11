'use server';

import { google } from 'googleapis';

export interface LessonData {
  label: string;
  value: string;
}

interface FetchLessonByClassNameResponse {
  success: boolean;
  error?: string;
  data?: LessonData[];
}

// Function to capitalize the first letter of each word in a string
const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const fetchLessonByClassName = async (
  className: string,
): Promise<FetchLessonByClassNameResponse> => {
  try {
    // Capitalize the first letter of each word in the class name
    const formattedClassName = capitalizeWords(className);

    const auth = await google.auth.getClient({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch classes sheet to find the class ID for the given class name
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

    // Fetch lessons sheet to find the lesson names for the found class ID
    const lessonsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'lessons!A2:C',
    });

    const lessonRows = lessonsResponse.data.values;

    if (!lessonRows || lessonRows.length === 0) {
      return {
        success: false,
        error: 'No data found in lessons sheet',
      };
    }

    const lessons = lessonRows
      .filter((row) => row[2] === classId)
      .map((row) => ({
        label: row[1], // lesson_name
        value: row[1], // lesson_name
      }));

    if (lessons.length === 0) {
      return {
        success: false,
        error: 'No lessons found for the given class ID',
      };
    }

    return {
      success: true,
      data: lessons,
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch lesson data: ${error}`,
    };
  }
};
