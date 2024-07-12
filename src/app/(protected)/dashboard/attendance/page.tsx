import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { AttendanceClient } from '@/components/tables/attendance-tables/attendance-client';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Attendance', link: '/dashboard/attendance' },
];
export default function page() {
  return (
    <>
      <div className='flex-1 space-y-4  p-4 pt-6 md:p-8'>
        <Breadcrumbs items={breadcrumbItems} />
        <AttendanceClient />
        {/* <UserClient data={users} /> */}
      </div>
    </>
  );
}
