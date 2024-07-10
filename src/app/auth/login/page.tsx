'use client';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { Link } from 'next-view-transitions';
import React from 'react';

import { DEFAULT_LOGIN_REDIRECT } from '@/lib/routes';

import LoginForm from '@/components/auth/LoginForm';
import { GoogleLogo } from '@/components/Icons';
import { Button } from '@/components/ui/button';
// import LoginForm from '@/components/auth/LoginForm';
// import { GoogleLogo } from '@/components/Icons';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const onClick = (provider: 'google' | 'github') => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

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

      <div className='flex items-center justify-center py-12 col-span-5'>
        <div className='mx-auto grid max-w-lg w-full gap-6 px-4'>
          <div className='grid gap-2 text-center'>
            <h1 className='text-5xl font-bold text-left'>Welcome Back! </h1>
            <p className='text-balance text-left text-muted-foreground'>
              Enter Your Credentials to Proceed
            </p>
          </div>
          <Button
            onClick={() => onClick('google')}
            variant='outline'
            className='space-x-2'
          >
            <GoogleLogo />
            <span>Continue with Google</span>
          </Button>

          <Separator />
          <LoginForm />
          <div className='text-center text-sm'>
            <Link
              href='/auth/register'
              className='hover:text-muted-foreground hover:underline duration-300 transition-all'
            >
              Sign up here!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
