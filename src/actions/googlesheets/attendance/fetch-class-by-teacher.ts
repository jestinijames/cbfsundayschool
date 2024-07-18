/* eslint-disable no-console */
'use server';

import { google } from 'googleapis';

interface ClassData {
  id: string;
  name: string;
}

interface FetchClassResponse {
  success: boolean;
  error?: string;
  data?: ClassData;
}

export const fetchClassByTeacherId = async (
  teacherId: string,
): Promise<FetchClassResponse> => {
  try {
    const auth = await google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch assignments sheet to find the class ID for the given teacher ID
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

    const assignment = assignmentRows.find((row) => row[0] === teacherId);

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
      id: classData[0],
      name: classData[1],
    };

    return {
      success: true,
      data: classInfo,
    };
  } catch (error) {
    console.error('Error fetching class data:', error);
    return {
      success: false,
      error: 'Failed to fetch class data',
    };
  }
};
