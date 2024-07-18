import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-background active:translate-y-px',
  {
    variants: {
      variant: {
        default: 'bg-primary text-root hover:bg-primary/80',
        affirmative:
          'bg-success-foreground text-root hover:bg-success-foreground/80 active:bg-success-foreground/80',
        destructive:
          'bg-destructive-foreground text-foreground hover:bg-destructive-foreground/80 hover:text-foreground/80 active:bg-destructive/90 active:text-foreground/90',
        outline:
          'border border-input bg-root hover:bg-accent/70 hover:text-accent-foreground hover:border-muted-foreground',
        input:
          'border border-input font-sans hover:text-accent-foreground bg-root hover:bg-root-foreground hover:border-muted-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/60 hover:text-secondary-foreground/80',
        ghost: 'hover:bg-accent/70 hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        xs: 'h-8 px-2 rounded-md',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export interface AnchorButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {}

const AnchorButton = React.forwardRef<HTMLAnchorElement, AnchorButtonProps>(
  ({ className, children, variant, size, ...props }, ref) => {
    return (
      <a
        ref={ref}
        aria-label='External link'
        className={cn(buttonVariants({ variant, size, className }))}
        target='_blank'
        rel='noreferrer noopener'
        {...props}
      >
        {children}
      </a>
    );
  },
);
AnchorButton.displayName = 'AnchorButton';

export { AnchorButton, Button, buttonVariants };
