import { z } from 'zod';

export const RegisterFormSchema = z
  .object({
    name: z.string().min(2, { message: 'Must be 2 or more characters...' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password should be more than 6 characters...' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Password should be more than 6 characters...' }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'], // The path to the field with the issue
      });
    }
  });

export type RegisterFormType = z.infer<typeof RegisterFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Not Valid' }),
  code: z.optional(z.string()),
});

export type LoginFormType = z.infer<typeof loginFormSchema>;

export const updatePasswordFormSchema = z.object({
  password: z
    .string()
    .min(6, { message: 'Password should be more than 6 characters...' }),
  confirmPassword: z
    .string()
    .min(6, { message: 'Password should be more than 6 characters...' }),
});

export type UpdatePasswordFormType = z.infer<typeof updatePasswordFormSchema>;

export const forgotPasswordFormSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordFormType = z.infer<typeof forgotPasswordFormSchema>;

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: 'Password should be more than 6 characters...' }),
});

export type NewPasswordFormType = z.infer<typeof NewPasswordSchema>;
