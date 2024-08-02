import { Table } from '@tanstack/react-table';
import { DownloadIcon, XIcon } from 'lucide-react';

import { exportTableToCSV } from '@/lib/export';

import { Button } from '@/components/custom/button';
import { DataTableFacetedFilter } from '@/components/tables/attendance-table/data-table-faceted-filter';
import { DataTableViewOptions } from '@/components/tables/attendance-table/data-table-view-options';

import { ClassData } from '@/actions/googlesheets/classes/read-classes';
import { StudentData } from '@/actions/googlesheets/students/read-students';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  classes: ClassData[];
  students: StudentData[];
}

export function ReportDataTableToolbar<TData>({
  table,
  classes,
  students,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className='flex items-center justify-between flex-wrap gap-2 py-4'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <div className='flex gap-x-2 gap-y-2 flex-wrap'>
          {table.getColumn('className') && (
            <DataTableFacetedFilter
              column={table.getColumn('className')}
              title='Class'
              options={classes}
            />
          )}
          {table.getColumn('studentName') && (
            <DataTableFacetedFilter
              column={table.getColumn('studentName')}
              title='Student'
              options={students}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <XIcon className='ml-2 h-4 w-4' />
          </Button>
        )}
        <Button
          variant='outline'
          size='sm'
          onClick={() =>
            exportTableToCSV(table, {
              filename: 'weekly-reports',
              excludeColumns: ['select', 'actions'],
            })
          }
        >
          <DownloadIcon className='mr-2 size-4' aria-hidden='true' />
          Export
        </Button>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
