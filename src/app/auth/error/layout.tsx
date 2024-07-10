import { Metadata } from 'next';
import * as React from 'react';

export const metadata: Metadata = {
  title: 'Error',
  description: 'Something went wrong',
};

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
