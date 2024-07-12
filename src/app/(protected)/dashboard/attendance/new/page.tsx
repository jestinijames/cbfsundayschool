import React from 'react';

import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Attendance', link: '/dashboard/attendance' },
  { title: 'Mark Attendace', link: '/dashboard/attendance/create' },
];
export default function Page() {
  return (
    <ScrollArea className='h-full'>
      <div className='flex-1 space-y-4 p-5'>
        <Breadcrumbs items={breadcrumbItems} />
        {/* <ProductForm
          categories={[
            { _id: 'shirts', name: 'shirts' },
            { _id: 'pants', name: 'pants' }
          ]}
          initialData={null}
          key={null}
        /> */}
      </div>
    </ScrollArea>
  );
}
