'use client';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
// import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

// import { User } from '@/constants/data';

// import { columns } from './columns';

// interface ProductsClientProps {
//   data: User[];
// }

//export const UserClient: React.FC<ProductsClientProps> = ({ data }) => {

export const AttendanceClient = () => {
  const router = useRouter();

  return (
    <>
      <div className='flex items-start justify-between'>
        <Heading
          // title={`Students (
          //   ${
          //   data.length
          //   }
          //   )`}
          title='Students'
          description='Manage student attendance'
        />
        <Button
          className='text-xs md:text-sm'
          onClick={() => router.push(`/dashboard/attendance/new`)}
        >
          <Plus className='mr-2 h-4 w-4' /> Mark New
        </Button>
      </div>
      <Separator />
      {/* <DataTable searchKey='name' columns={columns} data={data} /> */}
    </>
  );
};
