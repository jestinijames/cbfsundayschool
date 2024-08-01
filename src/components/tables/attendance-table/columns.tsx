'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/tables/attendance-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';

export type AttendanceRecord = {
  id: string;
  student: string;
  class: string;
  teacher: string;
  date: string;
  status: string;
};

export const columns: ColumnDef<AttendanceRecord>[] = [
  {
    accessorKey: 'student',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Student' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'class',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Class' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'teacher',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Teacher' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'lesson',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Lesson' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Attendance' />
    ),
    cell: ({ row }) => {
      const statusValue = row.original.status;
      const status =
        statusValue === 'Present' ? (
          <Badge variant='success'>{statusValue}</Badge>
        ) : (
          <Badge variant='destructive'>{statusValue}</Badge>
        );

      return status;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
