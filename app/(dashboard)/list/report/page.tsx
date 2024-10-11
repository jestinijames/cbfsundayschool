'use client';

import { useEffect, useState } from 'react';

import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { DataTableSkeleton } from '@/components/tables/attendance-table/data-table-skeleton';
import { reportcolumns } from '@/components/tables/report-table/report-columns';
import { ReportDataTable } from '@/components/tables/report-table/report-data-table';
import {
  transformData,
  TransformedRecord,
} from '@/components/tables/report-table/report-transform-data';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

import { fetchAttendanceRecords } from '@/actions/googlesheets/attendance/fetch-attendance-records';
import {
  ClassData,
  readAllClasses,
} from '@/actions/googlesheets/classes/read-classes';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/' },
  { title: 'Report', link: '/list/report' },
];

export default function ReportPage() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [currentClassFilter, setCurrentClassFilter] = useState('');

  const [transformedRecords, setTransformedRecords] = useState<
    TransformedRecord[]
  >([]);
  const [studentAttendanceMap, setStudentAttendanceMap] = useState<{
    [key: string]: { total: number; present: number };
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      const response = await readAllClasses();
      if (response.success && response.data) {
        setClasses(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong.',
          description: response.error,
        });
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetchAttendanceRecords();
      if (response.success && response.data) {
        const { transformedData, studentAttendanceMap } = transformData(
          response.data
        );

        setTransformedRecords(transformedData);
        setStudentAttendanceMap(studentAttendanceMap);
        setIsLoading(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong.',
          description: response.error || 'Failed to fetch report data',
          duration: 99999999999,
        });
        setIsLoading(false);
      }
    };
    fetchClasses();

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <>
        <div className='flex-1 space-y-4 p-5'>
          <div className='flex items-center justify-between'>
            <Heading
              title='Attendance Report'
              description='Full attendance report'
            />
          </div>
          <Separator />
          <section className='flex flex-col gap-y-4'>
            <DataTableSkeleton
              columnCount={6}
              filterableColumnCount={2}
              cellWidths={[
                '12rem',
                '12rem',
                '12rem',
                '12rem',
                '12rem',
                '12rem',
              ]}
              shrinkZero
            />
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      <div className='flex-1 space-y-4 p-5'>
        <Breadcrumbs items={breadcrumbItems} />
        <div className='flex items-center justify-between'>
          <Heading
            title='Attendance Report'
            description='Full attendance report'
          />
        </div>
        <Separator />
        <section className='flex flex-col gap-y-4'>
          <ReportDataTable
            columns={reportcolumns(
              transformedRecords,
              studentAttendanceMap,
              currentClassFilter
            )}
            data={transformedRecords}
            classes={classes}
            setCurrentClassFilter={setCurrentClassFilter}
          />
        </section>
      </div>
    </>
  );
}
