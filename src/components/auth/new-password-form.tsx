'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircleIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { NewPasswordFormType, NewPasswordSchema } from '@/lib/schema';

import ErrorAlert from '@/components/alerts/error-alert';
import SuccessAlert from '@/components/alerts/success-alert';
import { Button } from '@/components/custom/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { newPassword } from '@/actions/new-password';

export default function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();

  const form = useForm<NewPasswordFormType>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  async function onSubmit(values: NewPasswordFormType) {
    setError('');
    setSuccess('');
    startTransition(() => {
      newPassword(values, token).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
        form.reset();
      });
    });
  }

  return (
    <>
      {success ? (
        <div className='flex flex-col gap-2 items-center justify-center h-full w-full'>
          <Image
            src='/forgot-email-sent.svg'
            alt='Password reset email sent SVG icon'
            height={100}
            width={100}
            className='h-20 w-20'
          />

          <p className='text-2xl font-bold'>📧 Password Reset!! 📧</p>

          <p className='text-lg text-center text-muted-foreground'>
            Your password has been reset successfully.
          </p>
          <Link href='/auth/login'>
            <Button>Try Logging in</Button>
          </Link>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <div className='flex-1 grid gap-2'>
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        disabled={isPending}
                        placeholder='******'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            {error ? <ErrorAlert error={error} /> : null}
            {success ? <SuccessAlert success={success} /> : null}
            <Button type='submit' disabled={isPending}>
              {isPending ? (
                <span className='flex gap-2'>
                  <LoaderCircleIcon className='animate-spin' />
                  <span>Reset Password</span>
                </span>
              ) : (
                <span>Reset Password</span>
              )}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
