'use client';
import {
  createStudent,
  StudentData,
} from '@/actions/googlesheets/students/create-student';
import { StudentFormSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDate } from '@/components/tables/attendance-table/data-table';
import { useEffect, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { toast } from '@/components/ui/use-toast';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import {
  ClassData,
  readAllClassesById,
} from '@/actions/googlesheets/classes/read-classes-byid';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/custom/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
export default function StudentForm() {
  const addStudentForm = useForm<z.infer<typeof StudentFormSchema>>({
    resolver: zodResolver(StudentFormSchema),
  });
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: z.infer<typeof StudentFormSchema>) => {
    setLoading(true);

    const studentData: StudentData = {
      ...data,
      dob: formatDate(data.dob), // Convert date to string
    };

    const response = await createStudent(studentData);
    addStudentForm.setValue('name', '');
    addStudentForm.setValue('guardian1', '');
    addStudentForm.setValue('guardian2', '');
    addStudentForm.setValue('classId', '');

    if (response.success) {
      toast({
        variant: 'success',
        title: 'Student added successfully',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to add student',
        description: response.error,
      });
    }
    setLoading(false);
  };

  const isMutating = loading;

  const {
    formState: { errors },
  } = addStudentForm;
  console.log('err', errors);

  return (
    <>
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-1  lg:grid-cols-4'>
        <div className='flex-1 space-y-4  p-4 pt-6 md:p-8 overflow-y-scroll'>
          <div className='flex items-center justify-between'>
            <Heading title='Add Student' description='Add a new student' />
          </div>
          <Separator />
          <section className='flex flex-col gap-y-4'>
            <Form {...addStudentForm}>
              <form onSubmit={addStudentForm.handleSubmit(onSubmit)}>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
                  <NameField isMutating={isMutating} />
                  <ClassesField isMutating={isMutating} />
                  <GuardianOneField isMutating={isMutating} />
                  <GuardianTwoField isMutating={isMutating} />

                  <DOBField isMutating={isMutating} />
                </div>
                <Button
                  disabled={isMutating}
                  className='mt-10 mb-10'
                  type='submit'
                >
                  Create Student
                </Button>
              </form>
            </Form>
          </section>
        </div>
      </div>
    </>
  );
}

export function NameField({ isMutating }: { isMutating: boolean }) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name='name'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input
              placeholder='Enter a name'
              disabled={isMutating}
              aria-disabled={isMutating}
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function ClassesField({ isMutating }: { isMutating: boolean }) {
  const { control } = useFormContext();
  const [classes, setClasses] = useState<ClassData[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      const response = await readAllClassesById();
      if (response.success) {
        setClasses(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong.',
          description: response.error,
        });
      }
    };

    fetchClasses();
  }, []); // Empty dependency array to fetch only once on mount

  console.log(classes);
  return (
    <FormField
      control={control}
      name='classId'
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor='classId'>Class</FormLabel>
          <Select
            disabled={isMutating}
            aria-disabled={isMutating}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='Select a class' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {classes.length > 0 &&
                classes.map((item, index) => (
                  <SelectItem key={index} value={item.value}>
                    {item.label}
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

export function GuardianOneField({ isMutating }: { isMutating: boolean }) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name='guardian1'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Guardian One</FormLabel>
          <FormControl>
            <Input
              placeholder='Enter Guardian One'
              disabled={isMutating}
              aria-disabled={isMutating}
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function GuardianTwoField({ isMutating }: { isMutating: boolean }) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name='guardian2'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Guardian Two</FormLabel>
          <FormControl>
            <Input
              placeholder='Enter Guardian Two'
              disabled={isMutating}
              aria-disabled={isMutating}
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function DOBField({ isMutating }: { isMutating: boolean }) {
  const [popOverOpen, setPopOverOpen] = useState(false);
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name='dob'
      render={({ field }) => (
        <FormItem className='mt-3 flex flex-col'>
          <FormLabel htmlFor='dob'> Date of birth:</FormLabel>

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
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {field.value ? (
                    format(field.value as Date, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className='max-h-[var(--radix-popover-content-available-height)] w-[var(--radix-popover-trigger-width)] p-0'
              align='start'
            >
              <Calendar
                mode='single'
                captionLayout='dropdown-buttons'
                selected={field.value as Date}
                initialFocus
                onSelect={(date) => {
                  field.onChange(date);
                  setPopOverOpen(false);
                }}
                fromYear={1960}
                toYear={2030}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
