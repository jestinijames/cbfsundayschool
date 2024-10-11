'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/tables/attendance-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';

export type StudentAttendancePercentageRecord = {
  student: string;
  class: string;
  overallPercentage: number;
};

export const overallreportcolumns: ColumnDef<StudentAttendancePercentageRecord>[] =
  [
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
      accessorKey: 'student',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Student' />
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },

    {
      accessorKey: 'overallPercentage',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Attendance' />
      ),
      cell: ({ row }) => {
        const overallPercentage = row.original.overallPercentage;

        // give different variants of color based on the percentage
        const variant =
          overallPercentage >= 80
            ? 'success'
            : overallPercentage >= 60
              ? 'warning'
              : 'destructive';

        return <Badge variant={variant}>{Math.ceil(overallPercentage)}%</Badge>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
  ];
