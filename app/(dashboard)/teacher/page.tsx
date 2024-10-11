import React from 'react';

import AttendanceForm from '@/components/forms/attendance-form';
import { ScrollArea } from '@/components/ui/scroll-area';

const TeacherPage = () => {
  return (
    <>
      <ScrollArea className='h-full'>
        <div className='flex-1 space-y-4 p-5'>
          <AttendanceForm />
        </div>
      </ScrollArea>
    </>
  );
};

export default TeacherPage;
