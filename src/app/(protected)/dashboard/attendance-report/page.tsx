'use client';

import React, { useEffect, useState } from 'react';

import { DataTableSkeleton } from '@/components/tables/attendance-table/data-table-skeleton';
import { reportcolumns } from '@/components/tables/report-table/report-columns';
import { ReportDataTable } from '@/components/tables/report-table/report-data-table';
import { Heading } from '@/components/ui/heading';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

import {
  fetchReportData,
  ReportData,
} from '@/actions/googlesheets/reports/fetch-report-data';

export default function DashboardPage() {
  const [reportRecords, setReportRecords] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetchReportData();
      if (response.success && response.data) {
        setReportRecords(response.data);
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
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <>
        <ScrollArea className='h-full'>
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
                filterableColumnCount={6}
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
        </ScrollArea>
      </>
    );
  }

  return (
    <>
      <ScrollArea className='h-full'>
        <div className='flex-1 space-y-4 p-5'>
          <div className='flex items-center justify-between'>
            <Heading
              title='Attendance Report'
              description='Full attendance report'
            />
          </div>
          <Separator />
          <section className='flex flex-col gap-y-4'>
            <ReportDataTable columns={reportcolumns} data={reportRecords} />
          </section>
        </div>
      </ScrollArea>
    </>
  );
}
