import { Metadata } from 'next';
import * as React from 'react';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Forgot your password page',
};

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
