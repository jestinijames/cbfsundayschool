'use client';
import { DataTableSkeleton } from '@/components/tables/attendance-table/data-table-skeleton';
import { studentcolumns } from '@/components/tables/students-table/students-columns';
import { StudentsDataTable } from '@/components/tables/students-table/students-data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useDataContext } from '@/providers/DataProvider';

export default function ManageStudents() {
  const { isLoading, studentRecords, classes, students } = useDataContext();

  if (isLoading) {
    return (
      <>
        <div className='flex items-start justify-between'>
          <Heading
            title='Manage Students'
            description='Update or delete Student details'
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
          title='Manage Students'
          description='Update or delete Student details'
        />
      </div>
      <Separator />
      <StudentsDataTable
        columns={studentcolumns}
        data={studentRecords}
        classes={classes}
        students={students}
      />
    </>
  );
}
