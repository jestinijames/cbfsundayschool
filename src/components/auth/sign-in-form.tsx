'use client';

import * as Clerk from '@clerk/elements/common';
import * as SignIn from '@clerk/elements/sign-in';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SignInForm = () => {
  const { user } = useUser();

  const router = useRouter();

  useEffect(() => {
    const role = user?.publicMetadata.role;

    if (role) {
      router.push(`/${role}`);
    }
  }, [user, router]);

  return (
    <SignIn.Root>
      <SignIn.Step
        name='start'
        className=' p-12 rounded-md shadow-2xl flex flex-col gap-2'
      >
        {/* <h1 className='text-xl justify-center font-bold flex items-center gap-2'>
          <Image src={logo} alt='' width={48} height={48} />
        </h1> */}
        <h2 className='text-gray-400'>Sign in to your account</h2>
        <Clerk.GlobalError className='text-sm text-red-400' />
        <Clerk.Field name='identifier' className='flex-1 grid gap-2'>
          <div className='space-y-2'>
            <Clerk.Label className='text-xs text-gray-500'>
              Username
            </Clerk.Label>
            <Clerk.Input
              type='text'
              placeholder='Username'
              required
              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            />

            <Clerk.FieldError className='text-xs text-red-400' />
          </div>
        </Clerk.Field>
        <Clerk.Field name='password' className='flex-1 grid gap-2'>
          <div className='space-y-2'>
            <Clerk.Label className='text-xs text-gray-500'>
              Password
            </Clerk.Label>
            <Clerk.Input
              placeholder='Password'
              type='password'
              required
              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            />
            <Clerk.FieldError className='text-xs text-red-400' />
          </div>
        </Clerk.Field>
        <SignIn.Action
          submit
          className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2'
        >
          Sign In
        </SignIn.Action>
      </SignIn.Step>
    </SignIn.Root>
  );
};

export default SignInForm;
