'use client';

import { signOut } from 'next-auth/react';
import React from 'react';

import { useCurrentUser } from '@/hooks/use-current-user';

import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const user = useCurrentUser();

  const signUserOut = () => {
    signOut();
  };

  // console.log(classes);
  // console.log(session);

  return (
    <>
      <div>
        {JSON.stringify(user)}
        <form>
          <Button onClick={signUserOut}>Sign out</Button>
        </form>
      </div>
    </>
  );
}
