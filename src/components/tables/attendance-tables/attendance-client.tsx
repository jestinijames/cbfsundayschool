'use client';
import { useEffect, useState } from 'react';

import { DataTableSkeleton } from '@/components/tables/attendance-tables/data-table-skeleton';
// import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

import { fetchAttendanceRecords } from '@/actions/googlesheets/attendance/fetch-attendance-records';

import { AttendanceRecord, columns } from './columns';
import { DataTable } from './data-table';

export const AttendanceClient = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      const response = await fetchAttendanceRecords();
      if (response.success && response.data) {
        setAttendanceRecords(response.data);
        setIsLoading(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong.',
          description: response.error || 'Failed to fetch attendance records',
        });
      }
    };

    fetchRecords();
  }, []);

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
          columnCount={5}
          filterableColumnCount={6}
          cellWidths={['12rem', '12rem', '12rem', '12rem', '12rem']}
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
      <DataTable columns={columns} data={attendanceRecords} />
    </>
  );
};
