import { Link } from 'next-view-transitions';

import ForgotPasswordForm from '@/components/auth/forgot-password-form';
import AuthCover from '@/components/layout/auth-cover';

export default function ForgotPasswordPage() {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <AuthCover />
      <div className='flex h-full items-center p-4 lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Reset Your Password 🔒
            </h1>
            <p className='text-sm text-muted-foreground'>
              🚀 Get Back on Track in No Time!
            </p>
          </div>
          <ForgotPasswordForm />
          <p className='px-8 text-center text-sm text-muted-foreground'>
            Remember your password?{' '}
            <Link
              href='/auth/login'
              className='underline underline-offset-4 hover:text-primary'
            >
              Sign in here!
            </Link>{' '}
          </p>
        </div>
      </div>
    </div>
  );
}
