'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/tables/attendance-table/data-table-column-header';
import { calculateOverallAttendance } from '@/components/tables/report-table/report-transform-data';
import { Badge } from '@/components/ui/badge';

export type TransformedRecord = {
  week: string;
  lessonName: string;
  teacher: string;
  date: string;
  weeklyAttendance: string;
  studentsAttendance: { [key: string]: string };
  class: string;
};

export const reportcolumns = (
  attendanceRecords: TransformedRecord[],
  studentAttendanceMap: { [key: string]: { total: number; present: number } },
): ColumnDef<TransformedRecord, unknown>[] => {
  if (attendanceRecords.length === 0) return [];

  const students = Object.keys(attendanceRecords[0].studentsAttendance);

  const studentColumns: ColumnDef<TransformedRecord>[] = students.map(
    (student) => ({
      accessorKey: `studentsAttendance.${student}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={`${student} (${calculateOverallAttendance(student, studentAttendanceMap)}%)`}
        />
      ),
      cell: ({ row }) => {
        const statusValue = row.original.studentsAttendance[student];
        const status =
          statusValue === 'P' ? (
            <Badge variant='success'>Present</Badge>
          ) : (
            <Badge variant='destructive'>Absent</Badge>
          );

        return status;
      },
    }),
  );

  const columns: ColumnDef<TransformedRecord>[] = [
    {
      accessorKey: 'week',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Week' />
      ),
    },
    {
      accessorKey: 'class',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Class' />
      ),
    },
    {
      accessorKey: 'lessonName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Lesson Name' />
      ),
    },
    {
      accessorKey: 'teacher',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Session Teacher' />
      ),
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Class Date' />
      ),
    },
    {
      accessorKey: 'weeklyAttendance',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Weekly Attendance' />
      ),
    },
    ...studentColumns,
  ];

  return columns;
};
