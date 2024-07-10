'use client';
import { RefreshCcwIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import { newVerification } from '@/actions/new-verification';

export default function NewVerificationPage() {
  const router = useRouter();
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
    <div className='w-full lg:grid lg:grid-cols-8 min-h-screen'>
      <div className='hidden bg-muted lg:block col-span-3'>
        <Image
          src='/light-pattern.svg'
          alt='Image'
          width='1920'
          height='1080'
          className='h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
        />
      </div>

      <div className='flex items-center justify-center min-h-screen col-span-5'>
        <div className='mx-auto grid max-w-lg w-full gap-6 px-4'>
          <div className='grid gap-2 text-center'>
            <h1 className='text-5xl font-bold'>Confirming your verification</h1>
          </div>

          <div className='flex justify-center'>
            {!success && !error && (
              <RefreshCcwIcon className='h-12 w-12 animate-spin' />
            )}
            {!success ? <p className='text-red-600'>{error}</p> : null}
            {success ? <p className='text-green-600'>{success}</p> : null}
          </div>

          <div className='text-center text-sm'>
            <Button
              onClick={(e) => {
                e.preventDefault();
                router.push('/auth/login');
              }}
              className='mt-4 hover:text-muted-foreground hover:underline duration-300 transition-all'
            >
              Back to login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
