import { DataTableSkeleton } from '@/components/tables/attendance-table/data-table-skeleton';
import { overallreportcolumns } from '@/components/tables/overall-reports-table/overall-report-columns';
import { OverallReportDataTable } from '@/components/tables/overall-reports-table/overall-report-data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useDataContext } from '@/providers/DataProvider';

export default function OverallStudentAttendanceTracker() {
  const { isLoading, studentAttendancePercentage, classes, students } =
    useDataContext();

  if (isLoading) {
    return (
      <>
        <div className='flex items-start justify-between'>
          <Heading
            title='Overall Student Attendance'
            description='Overall student attendance percentage per class'
          />
        </div>
        <Separator />
        <DataTableSkeleton
          columnCount={3}
          filterableColumnCount={2}
          cellWidths={['6rem', '6rem', '6rem']}
          shrinkZero
        />
      </>
    );
  }

  return (
    <>
      <div className='flex items-start justify-between mt-5'>
        <Heading
          title='Overall Student Attendance'
          description='Overall student attendance percentage per class'
        />
      </div>
      <Separator />
      <OverallReportDataTable
        columns={overallreportcolumns}
        data={studentAttendancePercentage}
        classes={classes}
        students={students}
      />
    </>
  );
}
