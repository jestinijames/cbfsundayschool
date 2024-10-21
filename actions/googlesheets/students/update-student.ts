'use server';
import { google } from 'googleapis';

interface UpdateStudentData {
  id: string;
  name?: string;
  classId?: string;
  guardian1?: string;
  guardian2?: string;
  dob?: string;
}

export const updateStudent = async (updateData: UpdateStudentData) => {
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
    if (!students) {
      return { success: false, error: 'No students found' };
    }

    // Check if the student exists by ID
    const studentIndex = students.findIndex((row) => row[0] === updateData.id);
    if (studentIndex === -1) {
      return { success: false, error: 'Student not found' };
    }

    // Check for duplicate student names
    if (updateData.name) {
      const nameExists = students.some(
        (row) => row[1] === updateData.name && row[0] !== updateData.id
      );
      if (nameExists) {
        return { success: false, error: 'Student name already exists.' };
      }
    }

    const student = students[studentIndex];

    // Update student details
    student[1] = updateData.name || student[1];
    student[2] = updateData.classId || student[2];
    student[5] = updateData.guardian1 || student[5];
    student[6] = updateData.guardian2 || student[6];

    // Update age if DOB is provided
    if (updateData.dob) {
      const dob = new Date(updateData.dob);
      const ageInMilliseconds = Date.now() - dob.getTime();
      student[4] = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365)); // Recalculate age
      student[3] = updateData.dob;
    }

    // Update the student row in the sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `students!A${studentIndex + 2}:I${studentIndex + 2}`,
      valueInputOption: 'RAW',
      requestBody: { values: [student] },
    });

    return { success: true, message: 'Student updated successfully' };
  } catch (error) {
    return { success: false, error: `Failed to update student: ${error}` };
  }
};
