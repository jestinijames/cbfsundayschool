'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/tables/attendance-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';

import { ReportData } from '@/actions/googlesheets/reports/fetch-report-data';

// Define the static columns
const staticColumns: ColumnDef<ReportData>[] = [
  {
    accessorKey: 'studentName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Student Name' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'overallAttendance',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Overall Attendance' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'className',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Class Name' />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];

// Function to generate week columns dynamically
const generateWeekColumns = (
  weekData: {
    date: string;
    lesson: string;
    teacher: string;
    classAttendance: string;
  }[],
): ColumnDef<ReportData>[] => {
  const weekColumns: ColumnDef<ReportData>[] = [];

  // Extract unique week dates and lessons from the weekData
  weekData.forEach((week, index) => {
    const weekNumber = Math.ceil((index + 1) / 1); // Adjust according to your week definition

    weekColumns.push(
      {
        accessorKey: `week_${weekNumber}_date`,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={`Week ${weekNumber} Date`}
          />
        ),
        cell: ({ row }) => {
          const weekItem = row.original.weekData[index];
          return weekItem ? weekItem.date : 'N/A';
        },
      },
      {
        accessorKey: `week_${weekNumber}_lesson`,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={`Week ${weekNumber} Lesson`}
          />
        ),
        cell: ({ row }) => {
          const weekItem = row.original.weekData[index];
          return weekItem ? weekItem.lesson : 'N/A';
        },
      },
      {
        accessorKey: `week_${weekNumber}_teacher`,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={`Week ${weekNumber} Teacher`}
          />
        ),
        cell: ({ row }) => {
          const weekItem = row.original.weekData[index];
          return weekItem ? weekItem.teacher : 'N/A';
        },
      },
      {
        accessorKey: `week_${weekNumber}_attendance`,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={`Week ${weekNumber} Class Attendance`}
          />
        ),
        cell: ({ row }) => {
          const weekItem = row.original.weekData[index];
          const attendanceValue = weekItem ? weekItem.classAttendance : '0%';
          return (
            <Badge
              variant={
                parseFloat(attendanceValue) >= 80 ? 'success' : 'destructive'
              }
            >
              {attendanceValue}
            </Badge>
          );
        },
      },
    );
  });

  return weekColumns;
};

// Generate columns for up to 40 weeks, assuming your weekData is structured accordingly
export const reportcolumns: ColumnDef<ReportData>[] = [
  ...staticColumns,
  ...generateWeekColumns(
    Array.from({ length: 40 }, (_) => ({
      date: '',
      lesson: '',
      teacher: '',
      classAttendance: '',
    })),
  ),
];
