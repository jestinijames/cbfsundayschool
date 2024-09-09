'use client';
import { useSession } from 'next-auth/react';

import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import UserDenied from '@/components/user-management/user-denied';
import UserRoles from '@/components/user-management/user-roles';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Report', link: '/dashboard/user-management' },
];

export default function ReportPage() {
  const { data: session } = useSession();

  const userRole = session?.user?.role ?? '';

  return (
    <div className='flex-1 space-y-4 p-5'>
      <Breadcrumbs items={breadcrumbItems} />
      <div className='flex items-center justify-between'>
        <Heading title='User Management' description='Manage App Users' />
      </div>

      <Separator />
      {userRole === 'USER' && <UserDenied />}
      {userRole === 'ADMIN' && <UserRoles />}
      {userRole === '' && (
        <>
          <Skeleton className='h-[125px] w-[250px] rounded-xl' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-[250px]' />
            <Skeleton className='h-4 w-[200px]' />
          </div>
        </>
      )}
    </div>
  );
}
