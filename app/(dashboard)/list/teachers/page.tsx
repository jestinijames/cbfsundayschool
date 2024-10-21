import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import React from 'react';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/' },
  { title: 'Teachers Management', link: '/list/teachers' },
];

const TeachersPage = () => {
  return (
    <>
      <div className='flex-1 space-y-4 p-5'>
        <Breadcrumbs items={breadcrumbItems} />
        <div className='flex items-center justify-between'>
          <Heading
            title='Teacher Management'
            description='Manage teachers here'
          />
        </div>
        <Separator />
        <section className='flex flex-col gap-y-4'>COMING SOON!!</section>
      </div>
    </>
  );
};

export default TeachersPage;
