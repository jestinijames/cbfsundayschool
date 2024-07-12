import type { Metadata } from 'next';

import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'CBF Sunday School Dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className='flex h-screen overflow-hidden'>
        <Sidebar />
        <main className='flex-1 overflow-hidden pt-16'>{children}</main>
      </div>
    </>
  );
}
