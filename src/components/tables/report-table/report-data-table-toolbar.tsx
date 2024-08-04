import { Table } from '@tanstack/react-table';
import { DownloadIcon, XIcon } from 'lucide-react';

import { exportTableToCSV } from '@/lib/export';

import { Button } from '@/components/custom/button';
import { DataTableFacetedFilter } from '@/components/tables/attendance-table/data-table-faceted-filter';
import { DataTableViewOptions } from '@/components/tables/attendance-table/data-table-view-options';

import { ClassData } from '@/actions/googlesheets/classes/read-classes';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  classes: ClassData[];
}

export function ReportDataTableToolbar<TData>({
  table,
  classes,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className='flex items-center justify-between flex-wrap gap-2 py-4'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <div className='flex gap-x-2 gap-y-2 flex-wrap'>
          {table.getColumn('class') && (
            <DataTableFacetedFilter
              column={table.getColumn('class')}
              title='Class'
              options={classes}
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
              filename: 'full-report',
              excludeColumns: ['select', 'actions'],
              onlySelected: false, // Ensure full data is exported
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