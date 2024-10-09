import { Link } from 'next-view-transitions';

import RegisterForm from '@/components/auth/register-form';
import AuthCover from '@/components/layout/auth-cover';

export default function RegisterPage() {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <AuthCover />
      <div className='flex h-full items-center p-4 lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              🌟 Ready to Be Awesome?
            </h1>
            <p className='text-sm text-muted-foreground'>
              Create Your Account and Dive In 🌟
            </p>
          </div>
          <RegisterForm />
          <p className='px-8 text-center text-sm text-muted-foreground'>
            Already have an account?{' '}
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
