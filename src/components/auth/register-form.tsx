'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
//import { useRouter } from 'next13-progressbar';
import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { RegisterFormSchema, RegisterFormType } from '@/lib/schema';

import ErrorAlert from '@/components/alerts/error-alert';
import SuccessAlert from '@/components/alerts/success-alert';
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

import { register } from '@/actions/register';

// import { ServerActionReponse } from '@/types';

export default function RegisterForm() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: RegisterFormType) {
    startTransition(() => {
      setError('');
      setSuccess('');
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
          <div className='flex w-full gap-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <div className='flex-1 grid gap-2'>
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder='John'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder='you@example.com'
                    type='email'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <div className='flex justify-between items-center'>
                  <FormLabel>Password</FormLabel>
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

          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Confirm password'
                    type='password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error ? <ErrorAlert error={error} /> : null}
          {success ? <SuccessAlert success={success} /> : null}

          <Button type='submit' disabled={isPending}>
            {isPending ? (
              <span className='flex gap-2'>
                <LoaderCircle className='animate-spin' />
                <span>Register</span>
              </span>
            ) : (
              <span>Register</span>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
