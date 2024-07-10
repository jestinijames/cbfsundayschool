/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import '@/lib/env';

import { Button } from '@/components/ui/button';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className='flex flex-wrap'>
      <div className='w-full sm:w-8/12 mb-10'>
        <div className='container mx-auto h-full sm:p-10'>
          <nav className='flex px-4 justify-between items-center'>
            <div className='text-4xl font-bold'>
              CBF SUNDAY SCHOOL<span className='text-green-700'>.</span>
            </div>
            <div>
              <img
                src='https://image.flaticon.com/icons/svg/497/497348.svg'
                alt=''
                className='w-8'
              />
            </div>
          </nav>
          <header className='container px-4 lg:flex mt-10 items-center h-full lg:mt-0'>
            <div className='w-full'>
              <h1 className='text-4xl lg:text-6xl font-bold'>
                Your Personal{' '}
                <span className='text-primary'>Attendance Tracker</span>
              </h1>
              <div className='w-20 h-2 bg-primary my-4'></div>
              <p className='text-xl mb-10'>
                Welcome to our Sunday School Attendance Tracker! Streamline
                attendance management effortlessly with our user-friendly
                platform designed to enhance organization and ensure accurate
                record-keeping for your Sunday school.
              </p>
              <Button
                onClick={() => {
                  router.push('/auth/login');
                }}
                className='bg-primary text-white text-2xl font-bold p-6 rounded shadow mr-2'
              >
                Login
              </Button>

              <Button
                onClick={() => {
                  router.push('/auth/register');
                }}
                className='bg-secondary text-white text-2xl font-bold p-6 rounded shadow'
              >
                Register
              </Button>
            </div>
          </header>
        </div>
      </div>
      <img
        src='https://images.unsplash.com/photo-1536147116438-62679a5e01f2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80'
        alt='Leafs'
        className='w-full h-48 object-cover sm:h-screen sm:w-4/12'
      />
    </div>
  );
}
