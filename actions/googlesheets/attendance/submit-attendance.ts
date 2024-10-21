'use server';
import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';

export interface AttendanceData {
  teacher: string;
  class: string;
  lesson: string;
  date: string;
  students: {
    value: string;
    label: string;
    status: boolean;
  }[];
}

interface Response {
  success: boolean;
  error?: string;
}

export const submitAttendance = async (
  attendanceData: AttendanceData
): Promise<Response> => {
  try {
    const auth = await google.auth.getClient({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const formattedDate = attendanceData.date;

    // fetch classId from class name
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

    const classData = classRows.find((row) => row[1] === attendanceData.class);
    if (!classData) {
      return {
        success: false,
        error: 'Class not found in classes sheet',
      };
    }
    const classId = classData[0];

    // fetch teacherId from teacher name
    const teachersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'assignments!A2:E',
    });

    const teacherRows = teachersResponse.data.values;
    const activeTeachers = teacherRows?.filter((row) => row[4] === 't');

    if (!activeTeachers || activeTeachers.length === 0) {
      return {
        success: false,
        error: 'No data found in assignments sheet',
      };
    }

    const teacherData = activeTeachers.find(
      (row) => row[1] === attendanceData.teacher
    );
    if (!teacherData) {
      return {
        success: false,
        error: 'Teacher not found in assignments sheet',
      };
    }
    const teacherId = teacherData[0];

    // Fetch lessonId from lesson name
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

    const lessonData = lessonRows.find(
      (row) => row[1] === attendanceData.lesson
    );
    if (!lessonData) {
      return {
        success: false,
        error: 'Lesson not found in lessons sheet',
      };
    }
    const lessonId = lessonData[0];

    // Fetch existing attendance records
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'attendance!A2:F', // Adjust range if necessary
    });

    const rows = response.data.values || [];

    // Prepare new rows and update existing ones
    const newRows = [];
    const updateRequests = [];

    for (const student of attendanceData.students) {
      // get studentId from student name ie student.value

      const studentsResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'students!A2:I',
      });

      const studentRows = studentsResponse.data.values;
      const activeStudents = studentRows?.filter((row) => row[8] === 't');

      if (!activeStudents || activeStudents.length === 0) {
        return {
          success: false,
          error: 'No data found in students sheet',
        };
      }

      const studentData = activeStudents.find(
        (row) => row[1] === student.value
      );
      if (!studentData) {
        return {
          success: false,
          error: `Student ${student.value} not found in students sheet`,
        };
      }
      const studentId = studentData[0];

      const existingRow = rows.find(
        (row) =>
          row[1] === studentId &&
          row[2] === classId &&
          row[4] === formattedDate &&
          row[6] === lessonId
      );

      if (existingRow) {
        // Update existing row
        const rowIndex = rows.indexOf(existingRow) + 2; // +2 to account for header and 0-based index
        updateRequests.push({
          range: `attendance!F${rowIndex}`,
          values: [[student.status ? 'Present' : 'Absent']],
        });
      } else {
        // Add new row
        newRows.push([
          uuidv4(),
          studentId,
          classId,
          teacherId,
          formattedDate,
          student.status ? 'Present' : 'Absent',
          lessonId,
        ]);
      }
    }

    if (newRows.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'attendance!A:F',
        valueInputOption: 'RAW',
        requestBody: {
          values: newRows,
        },
      });
    }

    if (updateRequests.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        requestBody: {
          data: updateRequests.map((updateRequest) => ({
            range: updateRequest.range,
            majorDimension: 'ROWS',
            values: updateRequest.values,
          })),
          valueInputOption: 'RAW',
        },
      });
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: `Failed to submit attendance: ${error}` };
  }
};
