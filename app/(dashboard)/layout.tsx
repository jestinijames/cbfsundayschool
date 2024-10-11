import { currentUser } from '@clerk/nextjs/server';

import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';

import { ClerkProvider } from '@/providers/ClerkProvider';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;

  return (
    <>
      <ClerkProvider currentRole={role}>
        <Header />
        <div className='flex h-screen overflow-hidden'>
          <Sidebar />
          <main className='flex-1 overflow-scroll pt-16'>{children}</main>
        </div>
      </ClerkProvider>
    </>
  );
}
