'use server';
import { google } from 'googleapis';

export interface AttendanceRecord {
  id: string;
  student: string;
  class: string;
  teacher: string;
  date: string;
  status: string;
  lesson: string;
}

interface Response {
  success: boolean;
  error?: string;
  data?: AttendanceRecord[];
}

export const fetchAttendanceRecords = async (): Promise<Response> => {
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
      range: 'attendance!A2:G', // Updated range to include lesson_id
    });

    const studentsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'students!A2:I',
    });

    const classesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'classes!A2:B',
    });

    const assignmentsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'assignments!A2:E',
    });

    const lessonsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'lessons!A2:C',
    });

    const attendanceRows = attendanceResponse.data.values || [];
    const studentsRows = studentsResponse.data.values || [];
    const classesRows = classesResponse.data.values || [];
    const assignmentsRows = assignmentsResponse.data.values || [];
    const lessonsRows = lessonsResponse.data.values || [];

    const activeStudents = studentsRows.filter((row) => row[8] === 't');
    const activeTeachers = assignmentsRows.filter((row) => row[4] === 't');

    const studentsMap = new Map(activeStudents.map((row) => [row[0], row[1]])); // id -> name
    const classesMap = new Map(classesRows.map((row) => [row[0], row[1]])); // id -> name
    const teachersMap = new Map(activeTeachers.map((row) => [row[0], row[1]])); // id -> name
    const lessonsMap = new Map(lessonsRows.map((row) => [row[0], row[1]])); // id -> name

    let attendanceRecords: AttendanceRecord[] = attendanceRows.map((row) => ({
      id: row[0],
      student: studentsMap.get(row[1]) || 'N/A',
      class: classesMap.get(row[2]) || 'N/A',
      teacher: teachersMap.get(row[3]) || 'N/A',
      date: row[4],
      status: row[5],
      lesson: lessonsMap.get(row[6]) || 'N/A', // Mapping lesson_id to lesson_name
    }));

    // Sort the attendance records by date in ascending order
    attendanceRecords = attendanceRecords.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return { success: true, data: attendanceRecords };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch attendance records : ${error}`,
    };
  }
};
