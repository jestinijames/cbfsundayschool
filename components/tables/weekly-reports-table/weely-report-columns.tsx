'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/tables/attendance-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';

export type AttendancePercentageRecord = {
  class: string;
  weeklyPercentage: number;
};

export const weeklyreportcolumns: ColumnDef<AttendancePercentageRecord>[] = [
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
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
  },

  {
    accessorKey: 'weeklyPercentage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Attendance' />
    ),
    cell: ({ row }) => {
      const weeklyPercentage = row.original.weeklyPercentage;

      // give different variants of color based on the percentage
      const variant =
        weeklyPercentage >= 80
          ? 'success'
          : weeklyPercentage >= 60
            ? 'warning'
            : 'destructive';

      return <Badge variant={variant}>{Math.ceil(weeklyPercentage)}%</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
