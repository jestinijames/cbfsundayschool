// src/app/api/users/route.ts
import { NextResponse } from 'next/server';

import { getUsers } from '@/actions/user-fetch';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await getUsers();

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  const response = NextResponse.json({ users: result.users });
  response.headers.set('Cache-Control', 'no-store, must-revalidate'); // Disable caching
  return response;
}
