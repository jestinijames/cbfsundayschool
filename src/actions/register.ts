'use server';

import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail';
import { RegisterFormSchema, RegisterFormType } from '@/lib/schema';
import { generateVerificationToken } from '@/lib/tokens';

import { getUserByEmail } from '@/data/user';

export const register = async (values: RegisterFormType) => {
  const validatedFields = RegisterFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid Fields',
    };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      error: 'Email already in use',
    };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'USER',
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);
  return {
    success: 'Confirmation Email Sent',
  };
};
