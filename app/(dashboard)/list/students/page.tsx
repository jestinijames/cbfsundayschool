import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import React from 'react';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/' },
  { title: 'Students Management', link: '/list/students' },
];

const StudentsPage = () => {
  return (
    <>
      <div className='flex-1 space-y-4 p-5'>
        <Breadcrumbs items={breadcrumbItems} />
        <div className='flex items-center justify-between'>
          <Heading
            title='Student Management'
            description='Manage students here'
          />
        </div>
        <Separator />
        <section className='flex flex-col gap-y-4'>COMING SOON!!</section>
      </div>
    </>
  );
};

export default StudentsPage;
