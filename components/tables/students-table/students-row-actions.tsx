import { useEffect, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';

import { type Row } from '@tanstack/react-table';
import {
  FileEditIcon,
  GripVerticalIcon,
  PackageXIcon,
  Trash2Icon,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

import { toast } from '@/components/ui/use-toast';
import { UpdateStudentFormSchema } from '@/lib/schema';
import { LoadingSection } from '@/components/ui/loading-section';
import { deleteStudent } from '@/actions/googlesheets/students/delete-student';
import {
  ClassesField,
  DOBField,
  GuardianOneField,
  GuardianTwoField,
  NameField,
} from '@/components/forms/student-form';
import { Spinner } from '@/components/ui/spinner';
import {
  updateStudent,
  UpdateStudentData,
} from '@/actions/googlesheets/students/update-student';
import { Button } from '@/components/custom/button';

interface StudentRowActionsProps<TData> {
  row: Row<TData>;
}

export function StudentsRowActions<TData>({
  row,
}: StudentRowActionsProps<TData>) {
  const StudentRows = UpdateStudentFormSchema.parse(row.original);

  const [open, setOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button className='flex h-12 w-12 gap-2 bg-black p-0 hover:bg-neutral hover:bg-black/90 '>
            <span className='sr-only'>Open menu</span>
            <GripVerticalIcon className='size-6 bg-inherit' />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align='end'
          className='z-50 min-w-fit overflow-hidden rounded-md border bg-root/70 p-1 text-foreground shadow-md backdrop-blur-xl backdrop-brightness-150 animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
        >
          <div className='px-2 py-1.5 text-sm font-semibold'>Actions</div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className='w-full'>
              <div
                className='relative flex cursor-default select-none items-center justify-between gap-4 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:cursor-pointer focus:bg-accent focus:text-accent-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
                onSelect={(e) => {
                  e.stopPropagation();
                }}
              >
                Update Student Details
                <span className='sr-only'>Update Student Details</span>
                <FileEditIcon className='size-4' />
              </div>
            </DialogTrigger>
            <DialogContent className=' sm:min-w-[340px] md:min-w-[668px] lg:min-w-[780px] xl:min-w-[1080px] 2xl:min-w-[1118px]'>
              <DialogHeader>
                <DialogTitle>Update form</DialogTitle>
                <DialogDescription>
                  <UpdateStudentForm
                    StudentRows={StudentRows}
                    setOpen={setOpen}
                  />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Separator className='my-1 -ml-1 -mr-2 h-px bg-foreground' />
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger className='w-full'>
              <div
                className='relative flex cursor-default select-none items-center justify-between gap-4 rounded-sm bg-destructive px-2 py-1.5 text-sm text-destructive-foreground outline-none transition-colors hover:cursor-pointer hover:bg-destructive/90 hover:text-destructive-foreground/90 focus:bg-accent focus:text-accent-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
                onSelect={(e) => {
                  e.stopPropagation();
                }}
              >
                Delete Item
                <span className='sr-only'>Delete Item</span>
                <PackageXIcon className='size-4' />
              </div>
            </DialogTrigger>
            <DeleteStudentById
              studentData={StudentRows}
              setIsDeleteOpen={setIsDeleteOpen}
            />
          </Dialog>
        </PopoverContent>
      </Popover>
    </>
  );
}

function UpdateStudentForm({
  StudentRows,
  setOpen,
}: {
  StudentRows: z.infer<typeof UpdateStudentFormSchema>;
  setOpen: (open: boolean) => void;
}) {
  const updateStudentForm = useForm<z.infer<typeof UpdateStudentFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(UpdateStudentFormSchema),
  });

  useEffect(() => {
    updateStudentForm.reset(StudentRows);

    updateStudentForm.setValue('classId', StudentRows.classId);
  }, [updateStudentForm, StudentRows]);

  const [loading, setLoading] = useState<boolean>(false);

  const handleUpdate = async (
    data: z.infer<typeof UpdateStudentFormSchema>,
    setOpen: (open: boolean) => void
  ) => {
    setLoading(true);

    const response = await updateStudent(data);

    if (response.success) {
      toast({
        variant: 'success',
        title: 'Student updated successfully',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to delete student',
        description: response.error,
      });
    }
    setLoading(false);
    setOpen(false);
  };

  console.log(StudentRows, 'sr');

  return (
    <>
      <CardHeader>
        <CardTitle className='mb-5'>Update Student</CardTitle>
      </CardHeader>
      <div className='gap-y-4 sm:flex-row sm:gap-x-4'>
        <CardContent>
          <Form {...updateStudentForm}>
            <form
              onSubmit={updateStudentForm.handleSubmit((data) => {
                handleUpdate(data, setOpen);
              })}
            >
              <div className='mb-5 mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2'>
                <NameField isMutating={loading} />
                <ClassesField isMutating={loading} />
                <GuardianOneField isMutating={loading} />
                <GuardianTwoField isMutating={loading} />
                <DOBField isMutating={loading} />
              </div>
              <div className='flex items-center justify-end space-x-2 p-2'>
                <Button
                  type='submit'
                  disabled={loading}
                  aria-disabled={loading}
                >
                  {loading ? <Spinner size='xs' /> : ''}
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </div>
    </>
  );
}

function DeleteStudentById({
  studentData,
  setIsDeleteOpen,
}: {
  studentData: z.infer<typeof UpdateStudentFormSchema>;
  setIsDeleteOpen: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async (
    studentId: string,
    setIsDeleteOpen: (open: boolean) => void
  ) => {
    setLoading(true);

    const response = await deleteStudent(studentId.toString());

    if (response.success) {
      toast({
        variant: 'success',
        title: 'Student deleted successfully',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to delete student',
        description: response.error,
      });
    }
    setLoading(false);
    setIsDeleteOpen(false);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription>
          Do you want to delete the entry? Deleting this entry cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button aria-disabled={loading} disabled={loading} variant='outline'>
            Cancel
          </Button>
        </DialogClose>
        <Button
          variant='destructive'
          className='flex items-center gap-2'
          aria-disabled={loading}
          disabled={loading}
          onClick={() => {
            handleDelete(studentData?.id ?? '', setIsDeleteOpen);
          }}
        >
          {loading ? (
            <LoadingSection sectionSize='xs' />
          ) : (
            <Trash2Icon className='size-4' />
          )}
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
