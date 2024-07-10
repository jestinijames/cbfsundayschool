import { Metadata } from 'next';
import * as React from 'react';

export const metadata: Metadata = {
  title: 'Email Verification',
  description: 'Verifying if email is in db',
};

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
