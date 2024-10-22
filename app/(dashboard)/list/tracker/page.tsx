'use client';

import { useEffect, useState } from 'react';

import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

import { getDashboardTotals } from '@/actions/googlesheets/dashboard/get-dashboard-totals';
import Overview from '@/components/tracker/overview';
import { DataProvider } from '@/providers/DataProvider';
import AttendanceTracker from '@/components/tracker/attendance-tracker';
import WeeklyAttendanceTracker from '@/components/tracker/weekly-attendance-tracker';
import OverallStudentAttendanceTracker from '@/components/tracker/overall-student-attendance-tracker';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/' },
  { title: 'Tracker', link: '/list/tracker' },
];
export default function TrackerPage() {
  return (
    <>
      <DataProvider>
        <ScrollArea className='h-full'>
          <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
            <Breadcrumbs items={breadcrumbItems} />

            <Tabs defaultValue='overview' className='space-y-4'>
              <TabsList className='flex-wrap mb-10'>
                <TabsTrigger value='overview'>Overview</TabsTrigger>
                <TabsTrigger value='attendance'>Attendance Tracker</TabsTrigger>
                <TabsTrigger value='weekly'>
                  Weekly Attendance Tracker
                </TabsTrigger>
                <TabsTrigger value='overall'>
                  Overall Student Tracker
                </TabsTrigger>
              </TabsList>
              <TabsContent value='overview' className='space-y-4'>
                <Overview />
              </TabsContent>
              <TabsContent value='attendance' className='space-y-4'>
                <AttendanceTracker />
              </TabsContent>
              <TabsContent value='weekly' className='space-y-4'>
                <WeeklyAttendanceTracker />
              </TabsContent>
              <TabsContent value='overall' className='space-y-4'>
                <OverallStudentAttendanceTracker />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DataProvider>
    </>
  );
}
