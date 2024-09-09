/* eslint-disable no-console */
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { id, emailApproved } = await req.json();

    // Ensure that the required fields are provided
    if (!id || typeof emailApproved !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing id or emailApproved field' },
        { status: 400 },
      );
    }

    // Find the user in the database
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update the emailApproved field
    const updatedUser = await db.user.update({
      where: { id: existingUser.id },
      data: { emailApproved },
    });

    return NextResponse.json({
      success: `User ${updatedUser.name}'s approval status updated to ${
        updatedUser.emailApproved ? 'approved' : 'not approved'
      }.`,
    });
  } catch (error) {
    console.error('Error updating user approval:', error);
    return NextResponse.json(
      { error: 'Failed to update approval status' },
      { status: 500 },
    );
  }
}
