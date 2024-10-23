// Importing React from 'react' package.
// This is necessary to use JSX and other React features.
import * as React from 'react';

// Importing 'cn' (classNames) utility function from '@/lib/utils'.
// This utility function allows to merge and apply CSS classes to components in a more controlled manner.
import { cn } from '@/lib/utils';

// Define the properties (props) accepted by the Heading components.
// 'children' prop is expected to be a React node (anything that can be rendered in React).
// This component also accepts any HTML attributes valid for a <h1> element.
type HeadingProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>;

// Define a function component 'Heading1' using React.forwardRef to allow passing a ref.
// It accepts HeadingProps as props and returns a <h1> element.
// A 'className' string can be provided and it will be combined with the default classes.
// Additional props (...props) are spread onto the <h1> element.
// React.forwardRef is used to allow users to pass a ref to the Heading1 component if needed.
// This ref would be forwarded to the underlying <h1> HTML element.
export const Heading1 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h1
        ref={ref}
        className={cn(
          'scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl',
          className
        )}
        {...props}
      >
        {children}
      </h1>
    );
  }
);
Heading1.displayName = 'Heading1';
// Other heading components (Heading2, Heading3, Heading4) are defined in a similar manner,
// but they return <h2>, <h3> and <h4> elements respectively.
export const Heading2 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn(
          'scroll-m-20 text-2xl font-bold tracking-tight transition-colors',
          className
        )}
        {...props}
      >
        {children}
      </h2>
    );
  }
);
Heading2.displayName = 'Heading2';
export const Heading3 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          'scroll-m-20 text-xl font-bold tracking-tight',
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  }
);
Heading3.displayName = 'Heading3';
export const Heading4 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          'scroll-m-20 text-lg font-semibold tracking-tight',
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  }
);
Heading4.displayName = 'Heading4';
// Define the properties (props) accepted by the text components.
// 'children' prop is expected to be a React node.
// This component also accepts any HTML attributes valid for a <p> (paragraph) element.
type ParagraphProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLParagraphElement>;

// Define a function component 'Paragraph' using React.forwardRef to allow passing a ref.
// It accepts ParagraphProps as props and returns a <p> element.
// A 'className' string can be provided and it will be combined with the default classes.
// Additional props (...props) are spread onto the <p> element.
// React.forwardRef is used to allow users to pass a ref to the Paragraph component if needed.
// This ref would be forwarded to the underlying <p> HTML element.
export const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p ref={ref} className={cn('leading-6', className)} {...props}>
        {children}
      </p>
    );
  }
);
Paragraph.displayName = 'Paragraph';
// Other text components (Lead, Large, Small, Muted) are defined in a similar manner.
// They each represent a certain style of text and return <p> elements with different default CSS classes.
export const Lead = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-xl text-accent-foreground', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
Lead.displayName = 'Lead';
export const Large = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-lg font-semibold', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
Large.displayName = 'Large';
export const Small = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm font-medium leading-none', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
Small.displayName = 'Small';
export const Muted = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-accent-foreground', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
Muted.displayName = 'Muted';

// Define the properties (props) accepted by the UnorderedList component.
// 'children' prop is expected to be a React node.
// This component also accepts any HTML attributes valid for a <ul> (unordered list) element.
type UnorderedListProps = {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLUListElement>;
// Define a function component 'UnorderedList' using React.forwardRef to allow passing a ref.
// It accepts UnorderedListProps as props and returns a <ul> element.
// A 'className' string can be provided and it will be combined with the default classes.
// Additional props (...props) are spread onto the <ul> element.
// React.forwardRef is used to allow users to pass a ref to the UnorderedList component if needed.
// This ref would be forwarded to the underlying <ul> HTML element.
export const UnorderedList = React.forwardRef<
  HTMLUListElement,
  UnorderedListProps
>(({ className, children, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      className={cn('my-2 ml-6 list-disc [&>li]:mt-2', className)}
      {...props}
    >
      {children}
    </ul>
  );
});
UnorderedList.displayName = 'UnorderedList';
