import { Breadcrumbs } from '@/components/common/breadcrumbs';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Classes', link: '/dashboard/classes' },
];
export default function page() {
  return (
    <>
      <div className='flex-1 space-y-4  p-4 pt-6 md:p-8'>
        <Breadcrumbs items={breadcrumbItems} />
        {/* <UserClient data={users} /> */}
      </div>
    </>
  );
}
