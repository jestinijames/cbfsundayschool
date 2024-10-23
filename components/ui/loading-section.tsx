import type * as React from 'react';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { Spinner } from '@/components/ui/spinner';

// Define the variant classes for the section size and orientation
const VARIANT_CLASSES = {
  // These don't actually matter, lol
  // But guess why I'm doing this anyway
  sectionSize: {
    xs: 'p-0',
    sm: 'p-2',
    lg: 'p-6',
    default: 'p-4',
    full: 'p-8',
  },
  spinnerOrientation: {
    left: 'items-start',
    right: 'items-end',
    centre: 'items-center',
    default: 'items-center',
  },
};

// Use the cva function to assign the appropriate variant classes
// based on the given sectionSize and spinnerOrientation.
const loadingSectionVariants = cva(
  'flex h-full w-full flex-1 flex-col justify-center',
  {
    variants: VARIANT_CLASSES,
    defaultVariants: {
      sectionSize: 'default',
      spinnerOrientation: 'default',
    },
  }
);

// Define the props that the LoadingSection component will accept
export interface LoadingSectionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingSectionVariants> {}

// Define the LoadingSection component
export const LoadingSection: React.FC<LoadingSectionProps> = ({
  className,
  sectionSize,
  spinnerOrientation,
  ...props
}) => {
  // Generate the appropriate class string based on the given sectionSize and spinnerOrientation
  const divClass = loadingSectionVariants({
    sectionSize,
    spinnerOrientation,
    className,
  });

  return (
    <div className={divClass} {...props}>
      <Spinner size={sectionSize} />
    </div>
  );
};
