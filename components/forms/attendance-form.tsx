'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { AttendanceFormSchema } from '@/lib/schema';
import { cn } from '@/lib/utils';

import { Button } from '@/components/custom/button';
import { formatDate } from '@/components/tables/attendance-table/data-table';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

import { fetchClassByTeacherName } from '@/actions/googlesheets/attendance/fetch-class-by-teacher-name';
import {
  fetchLessonByClassName,
  LessonData,
} from '@/actions/googlesheets/attendance/fetch-lesson-by-class-name';
import { fetchStudentsByClassName } from '@/actions/googlesheets/attendance/fetch-students-by-class-name';
import {
  AttendanceData,
  submitAttendance,
} from '@/actions/googlesheets/attendance/submit-attendance';
import { ClassData } from '@/actions/googlesheets/classes/read-classes';
import {
  readAllTeachers,
  TeacherData,
} from '@/actions/googlesheets/teachers/read-teachers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AttendanceForm() {
  const markAttendanceMethods = useForm<z.infer<typeof AttendanceFormSchema>>({
    resolver: zodResolver(AttendanceFormSchema),
  });

  const [assignedClass, setAssignedClass] = useState<ClassData | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const {
    setValue,
    watch,
    //formState: { errors },
  } = markAttendanceMethods;
  const selectedTeacher = watch('teacher');

  useEffect(() => {
    if (selectedTeacher) {
      const fetchClass = async () => {
        const response = await fetchClassByTeacherName(selectedTeacher);
        if (response.success && response.data) {
          setAssignedClass(response.data);
          setValue('class', response.data.value);
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
    const studentAttendance = watch('students');
    //  Go through studentAttendance and check if all students are absent
    const allAbsent = studentAttendance.every((student) => !student.status);
    if (allAbsent) {
      toast({
        variant: 'destructive',
        title: 'All students are absent',
        description: 'Please mark attendance for at least one student.',
      });
      return;
    }

    setLoading(true);

    const attendanceData: AttendanceData = {
      ...data,
      date: formatDate(data.date), // Convert date to string
    };

    //  console.log(attendanceData, 'adta');

    const response = await submitAttendance(attendanceData);
    markAttendanceMethods.reset();
    setAssignedClass(null);
    setValue('students', []);

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
      <section className='flex flex-col gap-y-4'>
        <Form {...markAttendanceMethods}>
          <form onSubmit={markAttendanceMethods.handleSubmit(onSubmit)}>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
              <TeacherField isMutating={isMutating} />
              <LessonField isMutating={isMutating} />
              <DateField isMutating={isMutating} />
            </div>
            <StudentsAssignedField
              assignedClass={assignedClass}
              isMutating={isMutating}
            />
          </form>
        </Form>
      </section>
    </>
  );
}
function TeacherField({ isMutating }: { isMutating: boolean }) {
  const { control } = useFormContext();
  const [teachers, setTeachers] = useState<TeacherData[]>([]);

  useEffect(() => {
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

    fetchTeachers();
  }, []); // Empty dependency array to fetch only once on mount

  return (
    <FormField
      control={control}
      name='teacher'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Teacher</FormLabel>
          <Select
            disabled={isMutating}
            aria-disabled={isMutating}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='Select a teacher' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {teachers.length > 0 &&
                teachers.map((teacher, index) => (
                  <SelectItem key={index} value={teacher.value}>
                    {teacher.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function LessonField({ isMutating }: { isMutating: boolean }) {
  const { control, setValue, watch } = useFormContext();
  const [lessons, setLessons] = useState<LessonData[]>([]);

  const selectedClass = watch('class');

  // const [popOverOpen, setPopOverOpen] = useState(false);

  useEffect(() => {
    if (selectedClass) {
      const fetchLessons = async () => {
        const response = await fetchLessonByClassName(selectedClass);
        if (response.success && response.data) {
          setLessons(response.data);
        } else {
          toast({
            variant: 'destructive',
            title: 'Something went wrong.',
            description: response.error,
          });
        }
      };
      fetchLessons();
    }
  }, [selectedClass, setValue]);

  return (
    <FormField
      control={control}
      name='lesson'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Lesson</FormLabel>
          <Select
            disabled={isMutating}
            aria-disabled={isMutating}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='Select Lesson' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {lessons.length > 0 &&
                lessons.map((lessons, index) => (
                  <SelectItem key={index} value={lessons.value}>
                    {lessons.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function DateField({ isMutating }: { isMutating: boolean }) {
  const [popOverOpen, setPopOverOpen] = useState(false);
  const { control } = useFormContext();
  const startOfJuly = useMemo(
    () => new Date(new Date().getFullYear(), 6, 1),
    []
  );
  const endOfApril = useMemo(
    () => new Date(new Date().getFullYear() + 1, 3, 30),
    []
  );

  return (
    <FormField
      control={control}
      name='date'
      render={({ field }) => (
        <FormItem className='mt-3 flex flex-col'>
          <FormLabel htmlFor='date'> Date:</FormLabel>
          <Popover open={popOverOpen} onOpenChange={setPopOverOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='input'
                  disabled={isMutating}
                  aria-disabled={isMutating}
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    !field.value && 'text-accent-foreground'
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
                disabled={(date) => {
                  return (
                    date < startOfJuly ||
                    date > endOfApril ||
                    date.getDay() !== 0 // Disable if not Sunday
                  );
                }}
                initialFocus
                onSelect={(date) => {
                  field.onChange(date);
                  setPopOverOpen(false);
                }}
              />
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
      const fetchStudents = async () => {
        const response = await fetchStudentsByClassName(selectedClass);
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

      fetchStudents();
    }
  }, [selectedClass, setValue]);

  return (
    <>
      <Card className='mt-10'>
        <CardHeader>
          <CardTitle>{assignedClass ? assignedClass.label : ''}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className='mt-5'>
            <TableCaption>
              {fields.length == 0 && <span> No Data.</span>}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className='relative'>Student</TableHead>
                <TableHead className='relative'>Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell className='w-80 font-medium hidden'>
                    <FormField
                      control={control}
                      name={`students.${index.toString()}.value`}
                      render={() => (
                        <FormItem className='flex flex-col '>
                          <FormControl>
                            <Input
                              disabled
                              aria-disabled
                              {...register(
                                `students.${index.toString()}.value`,
                                {
                                  required: true,
                                }
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
                      name={`students.${index.toString()}.label`}
                      render={() => (
                        <FormItem className='flex flex-col '>
                          <FormControl>
                            <Input
                              disabled
                              aria-disabled
                              {...register(
                                `students.${index.toString()}.label`,
                                {
                                  required: true,
                                }
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
                              disabled={isMutating}
                              aria-disabled={isMutating}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button disabled={isMutating} className='mt-10 mb-10' type='submit'>
            Mark Attendance
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
