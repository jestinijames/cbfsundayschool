'use client';

import { signIn } from 'next-auth/react';

import { DEFAULT_LOGIN_REDIRECT } from '@/lib/routes';

import { GoogleLogo } from '@/components/Icons';
import { Button } from '@/components/ui/button';

export default function GoogleSignInButton() {
  const onClick = (provider: 'google' | 'github') => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <Button
      className='w-full'
      variant='outline'
      type='button'
      onClick={() => onClick('google')}
    >
      <GoogleLogo className='mr-2 h-4 w-4' />
      Continue with Gmail
    </Button>
  );
}
