import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDataContext } from '@/providers/DataProvider';
import { PresentationIcon, SpeechIcon, UsersIcon } from 'lucide-react';

export default function Overview() {
  const { totals } = useDataContext();

  return (
    <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-1  lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Students</CardTitle>
          <UsersIcon className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {totals.students ? (
              totals.students
            ) : (
              <Skeleton className='w-16 h-6' />
            )}
          </div>
          <p className='text-xs text-muted-foreground'>Ages 4 and above</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Teachers</CardTitle>
          <SpeechIcon className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {totals.teachers ? (
              totals.teachers
            ) : (
              <Skeleton className='w-16 h-6' />
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Classes</CardTitle>
          <PresentationIcon className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {totals.classes ? (
              totals.classes
            ) : (
              <Skeleton className='w-16 h-6' />
            )}
          </div>
          <p className='text-xs text-muted-foreground'>Tiny tots - Youth</p>
        </CardContent>
      </Card>
    </div>
  );
}
