'use server';

import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';

import { readAllClasses } from './read-classes';

interface CreateClassResponse {
  success: boolean;
  error?: string;
}

export const createClass = async (
  name: string,
): Promise<CreateClassResponse> => {
  if (!name) {
    return {
      success: false,
      error: 'Class name is required',
    };
  }

  // Read all existing classes to check for duplicates
  const readResponse = await readAllClasses();

  if (!readResponse.success) {
    return {
      success: false,
      error: readResponse.error,
    };
  }

  const existingClasses = readResponse.data;
  const nameExists = existingClasses.some(
    (classData) => classData.name === name,
  );

  if (nameExists) {
    return {
      success: false,
      error: 'Class name already exists',
    };
  }

  // Generate a unique ID for the new class
  const id = uuidv4();

  try {
    const auth = await google.auth.getClient({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const newRow = [id, name];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'classes',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [newRow],
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create class',
    };
  }
};
