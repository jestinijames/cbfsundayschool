import { Metadata } from 'next';
import * as React from 'react';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login Page to sign-in user',
};

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
