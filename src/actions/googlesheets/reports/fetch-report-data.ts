/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use server';
import { google } from 'googleapis';

// Define interfaces for the report data
export interface ReportData {
  studentName: string;
  overallAttendance: string;
  className: string;
  weekData: WeekData[];
}

interface WeekData {
  date: string;
  lesson: string;
  teacher: string;
  classAttendance: string;
}

// Define response interface
interface Response {
  success: boolean;
  error?: string;
  data?: ReportData[];
}

export const fetchReportData = async (): Promise<Response> => {
  try {
    const auth = await google.auth.getClient({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch data from Google Sheets
    const studentsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'students!A2:C',
    });

    const attendanceResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'attendance!A2:F',
    });

    const classesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'classes!A2:B',
    });

    const assignmentsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'assignments!A2:B',
    });

    const lessonsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'lessons!A2:C',
    });

    // Parse rows from responses
    const studentsRows = studentsResponse.data.values || [];
    const attendanceRows = attendanceResponse.data.values || [];
    const classesRows = classesResponse.data.values || [];
    const assignmentsRows = assignmentsResponse.data.values || [];
    const lessonsRows = lessonsResponse.data.values || [];

    // Create maps for quick lookups

    const classesMap = new Map(classesRows.map((row) => [row[0], row[1]]));
    const teachersMap = new Map(assignmentsRows.map((row) => [row[0], row[1]]));
    const lessonsMap = new Map(lessonsRows.map((row) => [row[0], row[1]]));
    const classStudentsMap = new Map<string, string[]>(); // classId -> studentIds

    studentsRows.forEach((row) => {
      const classId = row[2];
      if (!classStudentsMap.has(classId)) {
        classStudentsMap.set(classId, []);
      }
      classStudentsMap.get(classId)?.push(row[0]);
    });

    // Calculate overall attendance
    const studentAttendanceMap = new Map<
      string,
      { presentDates: Set<string>; totalClasses: number }
    >();

    attendanceRows.forEach((row) => {
      //  console.log('Attendance Row:', row); // Debug log
      const studentId = row[1];
      const date = row[4];
      const status = row[5];

      if (!studentAttendanceMap.has(studentId)) {
        studentAttendanceMap.set(studentId, {
          presentDates: new Set(),
          totalClasses: 0,
        });
      }

      const studentAttendance = studentAttendanceMap.get(studentId)!;
      if (status === 'Present') {
        studentAttendance.presentDates.add(date);
      }
      studentAttendance.totalClasses += 1;
    });

    // Calculate overall attendance percentage
    const overallAttendanceMap = new Map<string, string>();
    studentAttendanceMap.forEach((value, studentId) => {
      const totalClasses = value.totalClasses || 1; // Prevent division by zero
      const attendancePercentage =
        (value.presentDates.size / totalClasses) * 100;
      overallAttendanceMap.set(
        studentId,
        `${Math.ceil(attendancePercentage)}%`,
      );
    });

    // Aggregate week data
    const weekDataMap = new Map<string, WeekData[]>();
    const uniqueDates = [
      ...new Set(attendanceRows.map((row) => row[4])),
    ].sort(); // Sort dates ascending

    uniqueDates.forEach((date, index) => {
      for (let week = 1; week <= 40; week++) {
        if (!weekDataMap.has(`week${week}`)) {
          weekDataMap.set(`week${week}`, []);
        }
        if (index + 1 === week) {
          attendanceRows.forEach((row) => {
            if (row[4] === date) {
              const lessonName = lessonsMap.get(row[6]) || 'N/A';
              const teacherName = teachersMap.get(row[3]) || 'N/A';

              const classAttendance = `${Math.ceil(((classStudentsMap.get(row[2])?.filter((studentId) => studentId === row[1]).length || 0) / classStudentsMap.get(row[2])!.length) * 100)}%`;

              weekDataMap.get(`week${week}`)!.push({
                date,
                lesson: lessonName,
                teacher: teacherName,
                classAttendance,
              });
            }
          });
        }
      }
    });

    // Create final report data
    const reportData: ReportData[] = [];

    studentsRows.forEach((studentRow) => {
      const studentId = studentRow[0];
      const studentName = studentRow[1];
      const classId = studentRow[2];
      const className = classesMap.get(classId) || 'N/A';
      const overallAttendance = overallAttendanceMap.get(studentId) || '0%';
      const weekData = Array.from(
        { length: 40 },
        (_, i) => weekDataMap.get(`week${i + 1}`) || [],
      );

      reportData.push({
        studentName,
        overallAttendance,
        className,
        weekData: weekData.flat(),
      });
    });

    return { success: true, data: reportData };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch report data: ${error}`,
    };
  }
};
