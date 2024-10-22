import { DataTable } from '@/components/tables/attendance-table/data-table';
import { DataTableSkeleton } from '@/components/tables/attendance-table/data-table-skeleton';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { columns } from '@/components/tables/attendance-table/columns';
import { useDataContext } from '@/providers/DataProvider';

export default function AttendanceTracker() {
  const { isLoading, attendanceRecords, classes, teachers, students } =
    useDataContext();

  if (isLoading) {
    return (
      <>
        <div className='flex items-start justify-between'>
          <Heading
            title='CBF Sunday School Attendance Tracker'
            description='View Student Attendance'
          />
        </div>
        <Separator />
        <DataTableSkeleton
          columnCount={6}
          filterableColumnCount={6}
          cellWidths={['12rem', '12rem', '12rem', '12rem', '12rem', '12rem']}
          shrinkZero
        />
      </>
    );
  }

  return (
    <>
      <div className='flex items-start justify-between'>
        <Heading
          title='CBF Sunday School Attendance Tracker'
          description='View Student Attendance'
        />
      </div>
      <Separator />
      <DataTable
        columns={columns}
        data={attendanceRecords}
        classes={classes}
        teachers={teachers}
        students={students}
      />
    </>
  );
}
