import { Metadata } from 'next';
import * as React from 'react';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Sign-up Page to register user',
};

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
