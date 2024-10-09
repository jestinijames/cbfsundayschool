'use server';

import { sendPasswordResetEmail } from '@/lib/mail';
import { forgotPasswordFormSchema, ForgotPasswordFormType } from '@/lib/schema';
import { generatePasswordResetToken } from '@/lib/tokens';

import { getUserByEmail } from '@/data/user';

export const reset = async (values: ForgotPasswordFormType) => {
  const validatedFields = forgotPasswordFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid Email',
    };
  }

  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return {
      error: 'Email does not exist!!',
    };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  return {
    success: 'Reset email sent!!',
  };
};
