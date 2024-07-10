/* eslint-disable no-console */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LoaderCircleIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Link } from 'next-view-transitions';
import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { loginFormSchema, LoginFormType } from '@/lib/schema';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { login } from '@/actions/login';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider'
      : '';

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormType) {
    setError('');
    setSuccess('');
    startTransition(() => {
      login(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <div className='flex-1 grid gap-2'>
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder='you@example.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <div className='flex justify-between items-center'>
                  <FormLabel>Password</FormLabel>

                  <Link
                    href='/auth/forgot-password'
                    className='text-sm text-muted-foreground hover:text-primary hover:underline  duration-300 transition-all'
                  >
                    Forgot Password?
                  </Link>
                </div>
                <FormControl>
                  <div className='relative'>
                    <Input
                      disabled={isPending}
                      placeholder='Password'
                      type={`${showPassword ? 'text' : 'password'}`}
                      {...field}
                    />
                    <span className='absolute top-0 right-1'>
                      {showPassword ? (
                        <Button
                          type='button'
                          size='icon'
                          variant='ghost'
                          className='rounded-full'
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Eye className='opacity-80' />
                        </Button>
                      ) : (
                        <Button
                          type='button'
                          size='icon'
                          variant='ghost'
                          className='rounded-full'
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <EyeOff className='opacity-80' />
                        </Button>
                      )}
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error ? <p className='text-red-600'>{error}</p> : null}
          {urlError ? <p className='text-red-600'>{urlError}</p> : null}
          {success ? <p className='text-green-600'>{success}</p> : null}
          <Button type='submit' disabled={isPending}>
            {isPending ? (
              <span className='flex gap-2'>
                <LoaderCircleIcon className='animate-spin' />
                <span>Login</span>
              </span>
            ) : (
              <span>Login</span>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
