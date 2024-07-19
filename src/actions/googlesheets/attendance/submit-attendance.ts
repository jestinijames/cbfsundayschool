'use server';
import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';

export interface AttendanceData {
  teacher: string;
  class: string;
  date: string;
  students: {
    id: string;
    name: string;
    status: boolean;
  }[];
}

interface Response {
  success: boolean;
  error?: string;
}

export const submitAttendance = async (
  attendanceData: AttendanceData,
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
      const existingRow = rows.find(
        (row) =>
          row[1] === student.id &&
          row[2] === attendanceData.class &&
          row[4] === formattedDate,
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
          student.id,
          attendanceData.class,
          attendanceData.teacher,
          formattedDate,
          student.status ? 'Present' : 'Absent',
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
    return { success: false, error: 'Failed to submit attendance' };
  }
};
