'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/tables/attendance-table/data-table-column-header';
import { Paragraph } from '@/components/ui/typography';
import { StudentsRowActions } from '@/components/tables/students-table/students-row-actions';

export type StudentRecord = {
  id: string;
  name: string;
  dob: string;
  age: number;
  guardian1: string;
  guardian2: string;
  className: string;
};

export const studentcolumns: ColumnDef<StudentRecord>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'dob',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date Of Birth' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'age',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Age' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'guardian1',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Guardian 1' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'guardian2',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Guardian 2' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'className',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Class' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    header: () => <Paragraph className='text-right'>Actions</Paragraph>,
    cell: ({ row }) => (
      <div className='flex justify-end'>
        <StudentsRowActions row={row} />
      </div>
    ),
  },
];
