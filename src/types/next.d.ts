import { User } from 'firebase/auth'; // Adjust the import based on your Firebase setup

declare module 'next' {
  interface NextApiRequest {
    user?: User | null; // Define the user property as optional
  }
}