/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import { db } from '@/lib/db';
import { loginFormSchema } from '@/lib/schema';

import { getUserByEmail, getUserById } from '@/data/user';

export const authConfig = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    error: '/auth/error',
    signIn: '/auth/login',
    signOut: '/',
  },

  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true;

      const existingUser = await getUserById(user.id ?? '');

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      // TODO : Add 2FA check

      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as Role;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    },

    authorized({ auth }: { auth: any }) {
      const isAuthenticated = !!auth?.user;

      return isAuthenticated;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      // name: 'credentials',
      // credentials: {
      //  email: { label: 'email', type: 'text' },
      //  password: { label: 'password', type: 'password' },
      // },
      async authorize(credentials) {
        const validatedFields = loginFormSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
        return null;

        //  const user = await getUser(
        //   credentials.email as string,
        //   credentials.password as string
        //  );

        //  return user ?? null;
      },
    }),
  ],
} satisfies NextAuthConfig;
