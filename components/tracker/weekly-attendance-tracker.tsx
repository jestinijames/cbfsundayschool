import { DataTableSkeleton } from '@/components/tables/attendance-table/data-table-skeleton';
import { WeeklyReportDataTable } from '@/components/tables/weekly-reports-table/weekly-report-data-table';
import { weeklyreportcolumns } from '@/components/tables/weekly-reports-table/weely-report-columns';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useDataContext } from '@/providers/DataProvider';
import React from 'react';

export default function WeeklyAttendanceTracker() {
  const { isLoading, attendancePercentage, classes } = useDataContext();

  if (isLoading) {
    return (
      <>
        <div className='flex items-start justify-between'>
          <Heading
            title='Weekly Attendance'
            description='Weekly attendance percentage per class'
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
          title='Weekly Attendance'
          description='Weekly attendance percentage per class'
        />
      </div>
      <Separator />
      <WeeklyReportDataTable
        columns={weeklyreportcolumns}
        data={attendancePercentage}
        classes={classes}
      />
    </>
  );
}
