import { Column } from '@tanstack/react-table';
import {
  ArrowUpDownIcon,
  EyeOffIcon,
  MoveDownIcon,
  MoveUpIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/custom/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  percentage?: number;
}

export function ReportDataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  percentage,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const excludeColumns = [
    'Week',
    'Class',
    'Lesson Name',
    'Session Teacher',
    'Class Date',
    'Weekly Attendance',
  ];

  const badgeColor = percentage
    ? percentage > 80
      ? 'success'
      : percentage > 50
        ? 'warning'
        : 'destructive'
    : 'destructive';

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='-ml-3 h-8 data-[state=open]:bg-accent'
          >
            {excludeColumns.includes(title) ? (
              <div className='flex flex-col items-center justify-center'>
                <span>{title}</span>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center'>
                <span
                  className={`font-bold ${
                    badgeColor === 'success'
                      ? 'text-green-500'
                      : badgeColor === 'warning'
                        ? 'text-yellow-500'
                        : 'text-red-500'
                  }`}
                >
                  {percentage}%
                </span>
                <span>{title}</span>
              </div>
            )}
            {column.getIsSorted() === 'desc' ? (
              <MoveUpIcon className='ml-2 h-4 w-4' />
            ) : column.getIsSorted() === 'asc' ? (
              <MoveDownIcon className='ml-2 h-4 w-4' />
            ) : (
              <ArrowUpDownIcon className='ml-2 h-4 w-4' />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <MoveUpIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <MoveDownIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOffIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
