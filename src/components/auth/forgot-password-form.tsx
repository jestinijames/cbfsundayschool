'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { forgotPasswordFormSchema, ForgotPasswordFormType } from '@/lib/schema';

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

import { reset } from '@/actions/reset';

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();

  const form = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: ForgotPasswordFormType) {
    setError('');
    setSuccess('');
    startTransition(() => {
      reset(values).then((data) => {
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
          <p className='text-2xl font-bold'>📧 Check you Mailbox 📧</p>

          <p className='text-lg text-center text-muted-foreground'>
            An email with the link to reset your password has be sent!
          </p>
          <Link href='/'>
            <Button>Go Back Home</Button>
          </Link>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <div className='flex-1 grid gap-2'>
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
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

            {error ? <ErrorAlert error={error} /> : null}
            {success ? <SuccessAlert success={success} /> : null}

            <Button type='submit' disabled={isPending}>
              {isPending ? (
                <span className='flex gap-2'>
                  <LoaderCircleIcon className='animate-spin' />
                  <span>Send Reset Link</span>
                </span>
              ) : (
                <span>Send Reset Link</span>
              )}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
