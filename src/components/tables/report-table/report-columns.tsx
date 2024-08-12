'use client';

import { ColumnDef } from '@tanstack/react-table';

import { ReportDataTableColumnHeader } from '@/components/tables/report-table/report-table-column-header';
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
  currentClassFilter: string,
): ColumnDef<TransformedRecord, unknown>[] => {
  if (attendanceRecords.length === 0) return [];

  // Filter attendance records based on the selected class
  const filteredRecords = attendanceRecords.filter(
    (record) => !currentClassFilter || record.class === currentClassFilter,
  );

  const students = Object.keys(
    filteredRecords.reduce(
      (acc, record) => {
        Object.keys(record.studentsAttendance).forEach((student) => {
          acc[student] = true;
        });
        return acc;
      },
      {} as { [key: string]: boolean },
    ),
  );

  const studentColumns: ColumnDef<TransformedRecord>[] = students.map(
    (student) => ({
      accessorKey: `studentsAttendance.${student}`,
      header: ({ column }) => (
        <ReportDataTableColumnHeader
          column={column}
          title={`${student} `}
          percentage={calculateOverallAttendance(student, studentAttendanceMap)}
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
        <ReportDataTableColumnHeader column={column} title='Week' />
      ),
    },
    {
      accessorKey: 'class',
      header: ({ column }) => (
        <ReportDataTableColumnHeader column={column} title='Class' />
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'lessonName',
      header: ({ column }) => (
        <ReportDataTableColumnHeader column={column} title='Lesson Name' />
      ),
    },
    {
      accessorKey: 'teacher',
      header: ({ column }) => (
        <ReportDataTableColumnHeader column={column} title='Session Teacher' />
      ),
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <ReportDataTableColumnHeader column={column} title='Class Date' />
      ),
    },
    {
      accessorKey: 'weeklyAttendance',
      header: ({ column }) => (
        <ReportDataTableColumnHeader
          column={column}
          title='Weekly Attendance'
        />
      ),
      cell: ({ row }) => {
        const weeklyAttendance = row.original.weeklyAttendance;

        const extractNumber = weeklyAttendance
          ? parseInt(weeklyAttendance.replace('%', ''))
          : 0;

        const variant =
          extractNumber >= 80
            ? 'success'
            : extractNumber >= 60
              ? 'warning'
              : 'destructive';

        return <Badge variant={variant}>{Math.ceil(extractNumber)}%</Badge>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    ...studentColumns,
  ];

  return columns;
};
