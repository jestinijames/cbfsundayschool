'use client';

import { PresentationIcon, SpeechIcon, UsersIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

import { getDashboardTotals } from '@/actions/googlesheets/dashboard/get-dashboard-totals';

export default function DashboardPage() {
  const { toast } = useToast();
  const [totals, setTotals] = useState<
    { teachers: number; students: number; classes: number } | undefined | null
  >(null);

  useEffect(() => {
    const fetchTeacherCount = async () => {
      try {
        const response = await getDashboardTotals();
        if (response.success) {
          setTotals(response.totals);
        } else {
          toast({
            variant: 'destructive',
            title: 'Something went wrong.',
            description: response.error,
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Something went wrong.',
          description: 'Failed to fetch teacher count',
        });
      }
    };

    fetchTeacherCount();
  }, []);

  return (
    <>
      <ScrollArea className='h-full'>
        <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
          <div className='flex items-center justify-between space-y-2'>
            <h2 className='text-3xl font-bold tracking-tight'>
              Hi, Welcome back 👋
            </h2>
          </div>
          <Tabs defaultValue='overview' className='space-y-4'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics' disabled>
                Analytics
              </TabsTrigger>
            </TabsList>
            <TabsContent value='overview' className='space-y-4'>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      Total Students
                    </CardTitle>
                    <UsersIcon className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {totals?.students ? (
                        totals.students
                      ) : (
                        <Skeleton className='w-16 h-6' />
                      )}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Ages 4 and above
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      Total Teachers
                    </CardTitle>
                    <SpeechIcon className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {totals?.teachers ? (
                        totals.teachers
                      ) : (
                        <Skeleton className='w-16 h-6' />
                      )}
                    </div>
                    {/* <p className='text-xs text-muted-foreground'>
                      Ages 4 and above
                    </p> */}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      Total Classes
                    </CardTitle>
                    <PresentationIcon className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {totals?.classes ? (
                        totals.classes
                      ) : (
                        <Skeleton className='w-16 h-6' />
                      )}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Tiny tots - Youth
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </>
  );
}
