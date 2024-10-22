'use server';
import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';

export interface StudentData {
  name: string;
  classId: string;
  guardian1: string;
  guardian2: string;
  dob: string; // format should match the one in the sheet (e.g., '4-Jan-07')
}

export const createStudent = async (studentData: StudentData) => {
  try {
    const auth = await google.auth.getClient({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const studentsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'students!A2:I',
    });

    const students = studentsResponse.data.values;
    const activeStudents = students?.filter((row) => row[8] === 't');

    if (!activeStudents) {
      return { success: false, error: 'No students found' };
    }

    // Check if student with the same name already exists
    const existingStudent = activeStudents.find(
      (row) => row[1] === studentData.name
    );
    if (existingStudent) {
      return {
        success: false,
        error: `Student ${studentData.name} already exists`,
      };
    }

    // Calculate age based on DOB
    const dob = new Date(studentData.dob);
    const ageInMilliseconds = Date.now() - dob.getTime();
    const age = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365));

    // Create new student entry
    const newStudent = [
      uuidv4(),
      studentData.name,
      studentData.classId,
      studentData.dob,
      age,
      studentData.guardian1,
      studentData.guardian2,
      'NA', // Assuming 'Co-ordinator' will be set later
      't', // New students are active by default
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'students!A:I',
      valueInputOption: 'RAW',
      requestBody: { values: [newStudent] },
    });

    return { success: true, message: 'Student created successfully' };
  } catch (error) {
    return { success: false, error: `Failed to create student: ${error}` };
  }
};
