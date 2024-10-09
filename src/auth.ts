import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';

import { db } from '@/lib/db';

import { authConfig } from '@/auth.config';

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  adapter: PrismaAdapter(db),
  ...authConfig,
});
