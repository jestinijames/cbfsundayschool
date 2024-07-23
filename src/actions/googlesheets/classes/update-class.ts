'use server';

import { google } from 'googleapis';

import { readAllClasses } from './read-classes';

interface UpdateClassResponse {
  success: boolean;
  error?: string;
}

export const updateClass = async (
  id: string,
  newName: string,
): Promise<UpdateClassResponse> => {
  if (!id || !newName) {
    return {
      success: false,
      error: 'Class ID and new name are required',
    };
  }

  // Read all existing classes
  const readResponse = await readAllClasses();

  if (!readResponse.success) {
    return {
      success: false,
      error: readResponse.error,
    };
  }

  const existingClasses = readResponse.data;
  const classIndex = existingClasses.findIndex(
    (classData) => classData.value === id,
  );

  if (classIndex === -1) {
    return {
      success: false,
      error: 'Class not found',
    };
  }

  // Check if the new name already exists (excluding the class being updated)
  const nameExists = existingClasses.some(
    (classData) => classData.label === newName && classData.value !== id,
  );

  if (nameExists) {
    return {
      success: false,
      error: 'Class name already exists',
    };
  }

  // Update the class name
  existingClasses[classIndex].label = newName;

  try {
    const auth = await google.auth.getClient({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Convert the updated class data back to the format required by the Google Sheets API
    const updatedRows = existingClasses.map((classData) => [
      classData.value,
      classData.label,
    ]);

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'classes', // Assuming the sheet name is 'classes'
      valueInputOption: 'RAW',
      requestBody: {
        values: [
          ['id', 'name'], // Add the header row
          ...updatedRows,
        ],
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update class',
    };
  }
};
