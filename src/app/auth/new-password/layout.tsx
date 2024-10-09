import { Metadata } from 'next';
import * as React from 'react';

export const metadata: Metadata = {
  title: 'New Password',
  description: 'Reset your password here',
};

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
