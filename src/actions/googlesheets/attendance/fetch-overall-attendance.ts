/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use server';
import { google } from 'googleapis';

interface AttendanceRecord {
  id: string;
  student: string;
  class: string;
  teacher: string;
  date: string;
  status: string;
  lesson: string;
}

interface AttendancePercentage {
  student: string;
  class: string;
  overallPercentage: number;
}

interface Response {
  success: boolean;
  error?: string;
  data?: AttendancePercentage[];
}

export const fetchOverallAttendancePercentage = async (): Promise<Response> => {
  try {
    const auth = await google.auth.getClient({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
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

    const attendanceRows = attendanceResponse.data.values || [];
    const studentsRows = studentsResponse.data.values || [];
    const classesRows = classesResponse.data.values || [];

    const studentsMap = new Map(studentsRows.map((row) => [row[0], row[1]])); // id -> name
    const classesMap = new Map(classesRows.map((row) => [row[0], row[1]])); // id -> name

    const attendanceRecords: AttendanceRecord[] = attendanceRows.map((row) => ({
      id: row[0],
      student: studentsMap.get(row[1]) || 'N/A',
      class: classesMap.get(row[2]) || 'N/A',
      teacher: 'N/A', // Assuming teacher info is not needed for this calculation
      date: row[4],
      status: row[5],
      lesson: 'N/A', // Assuming lesson info is not needed for this calculation
    }));

    // Calculate overall attendance percentages
    const studentAttendance = new Map<
      string,
      { present: number; total: number }
    >();

    attendanceRecords.forEach((record) => {
      if (!studentAttendance.has(record.student)) {
        studentAttendance.set(record.student, { present: 0, total: 0 });
      }
      const attendance = studentAttendance.get(record.student)!;
      attendance.total++;
      if (record.status === 'Present') {
        attendance.present++;
      }
    });

    const attendancePercentages: AttendancePercentage[] = Array.from(
      studentAttendance.entries(),
    ).map(([student, attendance]) => ({
      student,
      class:
        attendanceRecords.find((record) => record.student === student)?.class ||
        'N/A',
      overallPercentage: (attendance.present / attendance.total) * 100,
    }));

    return { success: true, data: attendancePercentages };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch overall attendance percentage: ${error}`,
    };
  }
};
