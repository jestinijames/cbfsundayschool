'use client';
import { useSearchParams } from 'next/navigation';
import { Link } from 'next-view-transitions';
import { useCallback, useEffect, useState } from 'react';

import ErrorAlert from '@/components/alerts/error-alert';
import SuccessAlert from '@/components/alerts/success-alert';
import AuthCover from '@/components/layout/auth-cover';

import { newVerification } from '@/actions/new-verification';

export default function NewVerificationPage() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = useCallback(() => {
    // This is because something useeffect gets called twice
    if (success || error) return;

    if (!token) {
      setError('Missing Token!!');
      return;
    }
    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError('Something went wrong!!');
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <AuthCover />
      <div className='flex h-full items-center p-4 lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Confirming your verification
            </h1>
          </div>
          {error ? <ErrorAlert error={error} /> : null}

          {success ? <SuccessAlert success={success} /> : null}
          <p className='px-8 text-center text-sm text-muted-foreground'>
            Remember your password?{' '}
            <Link
              href='/auth/login'
              className='underline underline-offset-4 hover:text-primary'
            >
              Back to login
            </Link>{' '}
          </p>
        </div>
      </div>
    </div>
  );
}
