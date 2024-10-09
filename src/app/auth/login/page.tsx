'use client';
import { Link } from 'next-view-transitions';
import React from 'react';

import LoginForm from '@/components/auth/login-form';
import AuthCover from '@/components/layout/auth-cover';

export default function LoginPage() {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <AuthCover />
      <div className='flex h-full items-center p-4 lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Welcome Back!
            </h1>
            <p className='text-sm text-muted-foreground'>
              Enter Your Credentials to Proceed
            </p>
          </div>
          <LoginForm />
          <p className='px-8 text-center text-sm text-muted-foreground'>
            Need to Register?{' '}
            <Link
              href='/auth/register'
              className='underline underline-offset-4 hover:text-primary'
            >
              Sign up here!
            </Link>{' '}
          </p>
        </div>
      </div>
    </div>
  );
}
