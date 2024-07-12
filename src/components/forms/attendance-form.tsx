'use client';

/* eslint-disable no-console */

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import type { z } from 'zod';

import { AttendanceFormSchema } from '@/lib/schema';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

import {
  readAllTeachers,
  TeacherData,
} from '@/actions/googlesheets/teachers/read-teachers';

export default function AttendanceForm() {
  const onSubmit = (data: z.infer<typeof AttendanceFormSchema>) => {
    console.log(data);
  };
  const markAttendanceMethods = useForm<z.infer<typeof AttendanceFormSchema>>({
    resolver: zodResolver(AttendanceFormSchema),
    defaultValues: {
      students: [],
    },
  });

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
          <TeachersField />
        </form>
      </Form>
    </>
  );
}

function TeachersField() {
  const { control, setValue } = useFormContext();
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      const response = await readAllTeachers();
      if (response.success) {
        console.log('Fetched teachers:', response.data);
        setTeachers(response.data);
      } else {
        console.error('Error fetching teachers:', response.error);
      }
      setLoading(false);
    };

    fetchTeachers();
  }, []);

  const usersData = useMemo(() => {
    console.log('Mapping teachers to usersData:', teachers);
    return (teachers || []).map((teacher) => ({
      label: teacher.name,
      value: teacher.id,
    }));
  }, [teachers]);

  console.log(usersData, 'ud');

  return (
    <FormField
      control={control}
      name='teacher'
      render={({ field }) => (
        <FormItem className='mt-2 flex flex-col'>
          <FormLabel htmlFor='teacher'>Teachers:</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  disabled={loading}
                  aria-disabled={loading}
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

// function ModuleSubscriptionForm({
//   id,
//   isMutating,
//   submitButton,
//   isEdit,
// }: ModuleSubscriptionFormProps) {
//   const {watch, setValue} = useFormContext();
//   const [selectedModules, setSelectedModules] = useState<
//     {value: string; label: string}[]
//   >([]);
//   const {modulesData, isLoading, error} = useCustomerModules();

//   useEffect(() => {
//     const moduleSubscriptions = watch("moduleSubscriptions") as
//       | {moduleId: {toString: () => number}; moduleName: string}[]
//       | undefined;

//     if (Array.isArray(moduleSubscriptions)) {
//       const selectedModules = moduleSubscriptions.map(
//         (module: {moduleId: {toString: () => number}; moduleName: string}) => {
//           return {
//             value: String(module.moduleId),
//             label: module.moduleName,
//           };
//         }
//       ) as {value: string; label: string}[];
//       setSelectedModules(selectedModules);
//       setValue("moduleSubscriptions", moduleSubscriptions);
//     }

//     console.log(moduleSubscriptions, "modssss");
//   }, [watch, setSelectedModules, setValue]);

//   // Render loading or error states if necessary
//   if (isLoading) return <Skeleton className="h-8 w-full" />;
//   if (error)
//     return (
//       <Paragraph className="font-semibold">Error loading modules</Paragraph>
//     );

//   // Main render return for the component
//   return (
//     <section className="flex items-center justify-between">
//       <div className="grid w-full items-center gap-2">
//         <Label htmlFor="moduleSubscriptions">Module Subscription:</Label>
//         <FancyMultiSelect
//           value={selectedModules}
//           disabled={isMutating || isEdit}
//           aria-disabled={isMutating || isEdit}
//           name="modules"
//           multiSelectData={modulesData}
//           onChange={(selectedModules) => {
//             setSelectedModules(selectedModules);
//             setValue(
//               "moduleSubscriptions",
//               selectedModules.map((module) => ({
//                 moduleId: parseInt(module.value),
//                 moduleName: module.label,
//                 buyerId: id,
//                 moduleOnboarded: parseInt(module.value) === 97 ? true : false, //only lite has instant onboarded
//               }))
//             );
//           }}
//         />
//       </div>
//       {submitButton}
//     </section>
//   );
// }
