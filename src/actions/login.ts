'use server';

import { AuthError } from 'next-auth';

import { sendVerificationEmail } from '@/lib/mail';
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/routes';
import { loginFormSchema, LoginFormType } from '@/lib/schema';
import { generateVerificationToken } from '@/lib/tokens';

import { getUserByEmail } from '@/data/user';

import { signIn } from '@/auth';

export const login = async (values: LoginFormType) => {
  const validatedFields = loginFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid Fields',
    };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      error: 'Email does not exist!!',
    };
  }
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return {
      success: 'Confirmation email sent!',
    };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            error: 'Invalid Credentials!',
          };

        default:
          return {
            error: 'Something went wrong!',
          };
      }
    }
    throw error;
  }
};
