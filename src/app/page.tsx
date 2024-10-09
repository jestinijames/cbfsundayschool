/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import '@/lib/env';

import HomeLogo from '@/components/common/home-logo';
import { Button } from '@/components/custom/button';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
        <div className='absolute inset-0 bg-zinc-900' />
        <HomeLogo />

        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              Welcome to our Sunday School Attendance Tracker! Streamline
              attendance management effortlessly with our user-friendly platform
              designed to enhance organization and ensure accurate
              record-keeping for your Sunday school.
            </p>
          </blockquote>
        </div>
      </div>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-left'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Authenticate Yourself
            </h1>
            <p className='text-sm text-muted-foreground'>
              Enter your email and password to login <br />
              or register for an account.
            </p>
          </div>

          <div className='grid gap-6'>
            <div className='grid gap-2'>
              <Button
                onClick={() => {
                  router.push('/auth/register');
                }}
                className='mt-2'
              >
                Register
              </Button>

              <Button
                onClick={() => {
                  router.push('/auth/login');
                }}
                className='mt-2'
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
