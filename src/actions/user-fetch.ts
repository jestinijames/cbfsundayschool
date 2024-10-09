import { db } from '@/lib/db';

export async function getUsers() {
  try {
    const users = await db.user.findMany({
      where: {
        role: 'USER', // Filter to fetch only users with the 'USER' role
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        emailApproved: true,
        role: true,
      },
    });

    if (!users || users.length === 0) {
      return { success: false, error: 'No users found' };
    }

    return { success: true, users };
  } catch (error) {
    return { success: false, error: 'Failed to fetch users' };
  }
}
