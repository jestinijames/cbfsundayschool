'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { AttendanceFormSchema } from '@/lib/schema';
import { cn } from '@/lib/utils';

import { formatDate } from '@/components/tables/attendance-tables/data-table';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';

import { fetchClassByTeacherId } from '@/actions/googlesheets/attendance/fetch-class-by-teacher';
import { fetchStudentsByClassId } from '@/actions/googlesheets/attendance/fetch-students-by-class';
import {
  AttendanceData,
  submitAttendance,
} from '@/actions/googlesheets/attendance/submit-attendance';
import { ClassData } from '@/actions/googlesheets/classes/read-classes';
import {
  readAllTeachers,
  TeacherData,
} from '@/actions/googlesheets/teachers/read-teachers';

export default function AttendanceForm() {
  const markAttendanceMethods = useForm<z.infer<typeof AttendanceFormSchema>>({
    resolver: zodResolver(AttendanceFormSchema),
    defaultValues: {
      students: [],
    },
  });

  const [assignedClass, setAssignedClass] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    setValue,
    watch,
    //formState: { errors },
  } = markAttendanceMethods;
  const selectedTeacher = watch('teacher');

  //console.log(errors, 'errors');

  useEffect(() => {
    if (selectedTeacher) {
      const fetchClass = async () => {
        const response = await fetchClassByTeacherId(selectedTeacher);
        if (response.success && response.data) {
          setAssignedClass(response.data);
          setValue('class', response.data.id);
        } else {
          toast({
            variant: 'destructive',
            title: 'Something went wrong.',
            description: response.error,
          });
        }
      };

      fetchClass();
    }
  }, [selectedTeacher, setValue]);

  const onSubmit = async (data: z.infer<typeof AttendanceFormSchema>) => {
    setLoading(true);

    //  console.log(data, 'attendanceDatabefore');

    const attendanceData: AttendanceData = {
      ...data,
      date: formatDate(data.date), // Convert date to string
    };

    //  console.log(attendanceData, 'attendanceDataafter');

    const response = await submitAttendance(attendanceData);
    if (response.success) {
      toast({
        variant: 'success',
        title: 'Attendance marked successfully',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to mark attendance',
        description: response.error,
      });
    }
    setLoading(false);
  };

  const isMutating = loading;

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title='Mark Attendance'
          description='Mark attendance of students'
        />
      </div>
      <Separator />
      <Form {...markAttendanceMethods}>
        <form onSubmit={markAttendanceMethods.handleSubmit(onSubmit)}>
          <TeachersField isMutating={isMutating} />
          <DateField isMutating={isMutating} />
          <StudentsAssignedField
            assignedClass={assignedClass}
            isMutating={isMutating}
          />

          <Button
            disabled={isMutating}
            className='ml-auto text-white mt-10'
            type='submit'
          >
            Mark Attendance
          </Button>
        </form>
      </Form>
    </>
  );
}

function TeachersField({ isMutating }: { isMutating: boolean }) {
  const { control, setValue } = useFormContext();
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
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
      setLoading(false);
    };

    fetchTeachers();
  }, []);

  const usersData = useMemo(() => {
    return (teachers || []).map((teacher) => ({
      label: teacher.name,
      value: teacher.id,
    }));
  }, [teachers]);

  return (
    <FormField
      control={control}
      name='teacher'
      render={({ field }) => (
        <FormItem className='mt-2 flex flex-col'>
          <FormLabel htmlFor='teacher'>Teacher:</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  disabled={loading || isMutating}
                  aria-disabled={loading || isMutating}
                  role='combobox'
                  className={cn(
                    'justify-between',

                    !field.value && 'text-accent-foreground',
                  )}
                >
                  {field.value
                    ? usersData.find(
                        (option) => option.value.toLowerCase() === field.value,
                      )?.label
                    : 'Select Teacher...'}
                  <ChevronsUpDownIcon className='ml-2 size-4 shrink-0 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0'>
              <Command
                filter={(value, search) => {
                  const sanitizedSearch = search.replace(
                    /[-\\^$*+?.()|[\]{}]/g,
                    '\\$&',
                  );

                  const searchRegex = new RegExp(sanitizedSearch, 'i');

                  const userLabel =
                    usersData.find((user) => user.value === value)?.label || '';

                  return searchRegex.test(userLabel) ? 1 : 0;
                }}
              >
                <CommandInput placeholder='Search for Teacher...' />
                <CommandEmpty>No Teachers found.</CommandEmpty>
                <div className='max-h-40 overflow-y-auto'>
                  <CommandGroup>
                    {usersData.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={(value) => {
                          setValue('teacher', value);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            'mr-2 size-4',
                            option.value.toLowerCase() === field.value
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </div>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function StudentsAssignedField({
  assignedClass,
  isMutating,
}: {
  assignedClass: ClassData | null;
  isMutating: boolean;
}) {
  const { watch, setValue, control, register } = useFormContext();

  const { fields } = useFieldArray({
    control,
    name: 'students',
  });

  const selectedClass = watch('class');

  useEffect(() => {
    if (selectedClass) {
      const fetchClass = async () => {
        const response = await fetchStudentsByClassId(selectedClass);
        if (response.success) {
          setValue('students', response.data);
        } else {
          toast({
            variant: 'destructive',
            title: 'Something went wrong.',
            description: response.error,
          });
        }
      };

      fetchClass();
    }
  }, [selectedClass, setValue]);

  return (
    <>
      <Card className='mt-10'>
        <CardHeader>
          <CardTitle>{assignedClass ? assignedClass.name : ''}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className='mt-5'>
            <TableCaption>
              {fields.length == 0 && <span> No Data.</span>}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className='relative'>Student ID</TableHead>
                <TableHead className='relative'>Student</TableHead>
                <TableHead className='relative'>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell className='w-80 font-medium'>
                    <FormField
                      control={control}
                      name={`students.${index.toString()}.id`}
                      render={() => (
                        <FormItem className='flex flex-col '>
                          <FormControl>
                            <Input
                              disabled
                              aria-disabled
                              {...register(`students.${index.toString()}.id`, {
                                required: true,
                              })}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  <TableCell className='w-80 font-medium'>
                    <FormField
                      control={control}
                      name={`students.${index.toString()}.name`}
                      render={() => (
                        <FormItem className='flex flex-col '>
                          <FormControl>
                            <Input
                              disabled
                              aria-disabled
                              {...register(
                                `students.${index.toString()}.name`,
                                {
                                  required: true,
                                },
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className='w-80 font-medium'>
                    <FormField
                      control={control}
                      name={`students.${index.toString()}.status`}
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <FormControl>
                            <Switch
                              checked={field.value as boolean}
                              disabled={isMutating}
                              aria-disabled={isMutating}
                              onCheckedChange={field.onChange}
                              {...register(
                                `students.${index.toString()}.status`,
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

function DateField({ isMutating }: { isMutating: boolean }) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name='date'
      render={({ field }) => (
        <FormItem className='mt-3 flex flex-col'>
          <FormLabel>Date:</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  disabled={isMutating}
                  aria-disabled={isMutating}
                  variant='input'
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    !field.value && 'text-accent-foreground',
                  )}
                >
                  {field.value ? (
                    format(field.value as Date, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className='ml-auto size-4 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className='max-h-[var(--radix-popover-content-available-height)] w-[var(--radix-popover-trigger-width)] p-0'
              align='start'
            >
              <Calendar
                mode='single'
                selected={field.value as Date}
                disabled={(date) =>
                  // Only this year and only sundays
                  date.getFullYear() !== new Date().getFullYear() ||
                  date.getDay() !== 0
                }
                initialFocus
                onSelect={field.onChange}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
