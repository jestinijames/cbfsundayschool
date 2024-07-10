import React from 'react';

import { Button } from '@/components/ui/button';

import { auth, signOut } from '@/auth';

import getAllClasses from './get-all-classes';

export default async function DashboardPage() {
  const session = await auth();

  const classes = await getAllClasses();

  // console.log(classes);
  // console.log(session);

  return (
    <>
      <div>
        {JSON.stringify(session)}
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <Button type='submit'>Sign out</Button>
        </form>
      </div>
      <div>
        <pre>{JSON.stringify(classes, null, 2)}</pre>
      </div>
    </>
  );
}
