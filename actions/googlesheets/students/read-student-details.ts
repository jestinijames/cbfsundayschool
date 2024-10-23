'use server';

import { google } from 'googleapis';

export interface StudentDetails {
  id: string;
  name: string;
  dob: string;
  age: number;
  guardian1: string;
  guardian2: string;
  className: string;
  classId: string; // Add classId to the interface
}

interface ReadStudentsResponse {
  success: boolean;
  error?: string;
  data?: StudentDetails[];
}

export const readStudentsWithClass =
  async (): Promise<ReadStudentsResponse> => {
    try {
      const auth = await google.auth.getClient({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheets = google.sheets({ version: 'v4', auth });

      // Fetch the students data
      const studentsResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'students!A2:I',
      });

      const students = studentsResponse.data.values;

      if (!students || students.length === 0) {
        return { success: false, error: 'No students found' };
      }

      // Filter active students
      const activeStudents = students.filter((row) => row[8] === 't'); // Active status is in column I (index 8)

      if (activeStudents.length === 0) {
        return { success: false, error: 'No active students found' };
      }

      // Fetch the classes data
      const classesResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'classes!A2:B', // Fetch class id and name
      });

      const classes = classesResponse.data.values;

      if (!classes || classes.length === 0) {
        return { success: false, error: 'No classes found' };
      }

      // Map classes by classId for easy lookup
      const classMap = new Map<string, string>();
      classes.forEach(([classId, className]) => {
        classMap.set(classId, className);
      });

      // Function to calculate age based on DOB
      const calculateAge = (dobString: string): number => {
        const dob = new Date(dobString);
        const ageInMilliseconds = Date.now() - dob.getTime();
        return Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365));
      };

      // Map active students to the required format
      const studentDetails: StudentDetails[] = activeStudents.map((row) => {
        const [id, name, classId, dob, , guardian1, guardian2] = row;
        const age = calculateAge(dob);
        const className = classMap.get(classId) || 'Unknown'; // Default to 'Unknown' if classId is not found

        return {
          id,
          name,
          dob,
          age,
          guardian1,
          guardian2,
          className,
          classId, // Include classId in the return object
        };
      });

      return {
        success: true,
        data: studentDetails,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to read students: ${error}`,
      };
    }
  };
