// src/app/api/users/route.ts
import { NextResponse } from 'next/server';

import { getUsers } from '@/actions/user-fetch';

export async function GET() {
  const result = await getUsers();

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json({ users: result.users });
}
