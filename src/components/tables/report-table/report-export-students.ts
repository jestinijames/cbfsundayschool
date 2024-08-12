import { type Table } from '@tanstack/react-table';

export function exportReportTableToCSV<TData>(
  table: Table<TData>,
  opts: {
    filename?: string;
    excludeColumns?: (keyof TData | 'select' | 'actions')[];
    onlySelected?: boolean;
  } = {},
): void {
  const {
    filename = 'report',
    excludeColumns = [],
    onlySelected = false,
  } = opts;

  // Retrieve headers (column names) and remove 'studentsAttendance_' prefix if present
  const headers = table
    .getAllLeafColumns()
    .map((column) => {
      const originalHeader = column.id as keyof TData | 'select' | 'actions';
      return originalHeader.toString().startsWith('studentsAttendance_')
        ? (originalHeader
            .toString()
            .replace('studentsAttendance_', '') as keyof TData)
        : originalHeader;
    })
    .filter((id) => !excludeColumns.includes(id));

  // Build CSV content
  const rows = onlySelected
    ? table.getFilteredSelectedRowModel().rows
    : table.getRowModel().rows; // Use getRowModel() to fetch all rows

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const originalHeader =
            //  attach studentsAttendance_ prefix to the header if it is not 'Week', 'Class', 'Lesson Name', 'Session Teacher', 'Class Date', 'Weekly Attendance'
            ![
              'week',
              'class',
              'lessonName',
              'teacher',
              'date',
              'weeklyAttendance',
            ].includes(header as string)
              ? `studentsAttendance_${String(header)}`
              : header;

          const cellValue = row.getValue(originalHeader as string);
          // Handle values that might contain commas or newlines
          return typeof cellValue === 'string'
            ? `"${cellValue.replace(/"/g, '""')}"`
            : cellValue;
        })
        .join(','),
    ),
  ].join('\n');

  // Create a Blob with CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create a link and trigger the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
