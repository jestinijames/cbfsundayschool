import { Table } from '@tanstack/react-table';
import { format } from 'date-fns';
import { CalendarIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/custom/button';
import { formatDate } from '@/components/tables/attendance-tables/data-table';
import { DataTableViewOptions } from '@/components/tables/attendance-tables/data-table-view-options';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';

import {
  ClassData,
  readAllClasses,
} from '@/actions/googlesheets/classes/read-classes';
import {
  readAllStudents,
  StudentData,
} from '@/actions/googlesheets/students/read-students';
import {
  readAllTeachers,
  TeacherData,
} from '@/actions/googlesheets/teachers/read-teachers';
import { statuses } from '@/constant/data';

import { DataTableFacetedFilter } from './data-table-faceted-filter';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [date, setDate] = useState<Date>();

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
    const fetchTeachers = async () => {
      const response = await readAllTeachers();
      if (response.success) {
        setTeachers(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong.',
          description: response.error,
        });
      }
    };

    const fetchStudents = async () => {
      const response = await readAllStudents();
      if (response.success) {
        setStudents(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong.',
          description: response.error,
        });
      }
    };

    fetchClasses();
    fetchTeachers();
    fetchStudents();
  }, []);

  return (
    <div className='flex items-center justify-between flex-wrap gap-2 py-4'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <div className='flex gap-x-2'>
          {table.getColumn('student') && (
            <DataTableFacetedFilter
              column={table.getColumn('student')}
              title='Student'
              options={students}
            />
          )}
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Status'
              options={statuses}
            />
          )}

          {table.getColumn('class') && (
            <DataTableFacetedFilter
              column={table.getColumn('class')}
              title='Class'
              options={classes}
            />
          )}
          {table.getColumn('teacher') && (
            <DataTableFacetedFilter
              column={table.getColumn('teacher')}
              title='Teacher'
              options={teachers}
            />
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className={cn(
                  'max-w-sm justify-start text-left font-normal ml-2',
                  !date && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={date}
                onSelect={(date) => {
                  setDate(date);
                  const formattedDate = date ? formatDate(date) : '';
                  table.getColumn('date')?.setFilterValue(formattedDate);
                }}
                initialFocus
                disabled={
                  (date) =>
                    // Only this year and only sundays
                    date.getFullYear() !== new Date().getFullYear()
                  // Dont delete below. may need later
                  // || date.getDay() !== 0
                }
              />
            </PopoverContent>
          </Popover>
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <XIcon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
