'use server';
import { google } from 'googleapis';

export interface AttendanceRecord {
  id: string;
  student: string;
  class: string;
  teacher: string;
  date: string;
  status: string;
}

interface Response {
  success: boolean;
  error?: string;
  data?: AttendanceRecord[];
}

export const fetchAttendanceRecords = async (): Promise<Response> => {
  try {
    const auth = await google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const attendanceResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'attendance!A2:F',
    });

    const studentsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'students!A2:G',
    });

    const classesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'classes!A2:B',
    });

    const assignmentsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'assignments!A2:B',
    });

    const attendanceRows = attendanceResponse.data.values || [];
    const studentsRows = studentsResponse.data.values || [];
    const classesRows = classesResponse.data.values || [];
    const assignmentsRows = assignmentsResponse.data.values || [];

    const studentsMap = new Map(studentsRows.map((row) => [row[0], row[1]])); // id -> name
    const classesMap = new Map(classesRows.map((row) => [row[0], row[1]])); // id -> name
    const teachersMap = new Map(assignmentsRows.map((row) => [row[0], row[1]])); // id -> name

    const attendanceRecords: AttendanceRecord[] = attendanceRows.map((row) => ({
      id: row[0],
      student: studentsMap.get(row[1]) || 'Unknown',
      class: classesMap.get(row[2]) || 'Unknown',
      teacher: teachersMap.get(row[3]) || 'Unknown',
      date: row[4],
      status: row[5],
    }));

    return { success: true, data: attendanceRecords };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch attendance records : ${error}`,
    };
  }
};
