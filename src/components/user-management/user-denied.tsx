'use client';
import React from 'react';

const UserDenied = () => {
  return (
    <>
      <section className='flex flex-col gap-y-4 items-center justify-center h-screen w-full'>
        <h1 className='text-4xl font-bold leading-tight'>Access Denied 🚫</h1>
        <p className='text-center text-muted-foreground'>
          You are not authorized to view this page. <br />
          Please contact the administrator if you believe this is a mistake.
        </p>
      </section>
    </>
  );
};

export default UserDenied;
