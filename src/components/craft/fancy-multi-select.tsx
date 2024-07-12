import { XIcon } from 'lucide-react';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import { z } from 'zod';

import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInputUnstyled,
  CommandItem,
} from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paragraph } from '@/components/ui/typography';

// Define a schema for the data used in multi-select.
// zod is used here to define the schema
export const multiSelectDatumSchema = z.object({
  value: z.string(), // Each option in the multi-select should have a string value
  label: z.string(), // Each option should also have a label, also a string
});

// Infer a TypeScript type from the Zod schema
export type MultiSelectDatum = z.infer<typeof multiSelectDatumSchema>;

// Define the props type for our FancyMultiSelect component
interface FancyMultiSelectProps {
  multiSelectData: MultiSelectDatum[]; // Array of multi-select data options
  value: MultiSelectDatum[]; // Currently selected multi-select options
  name: string; // Name of the multi-select
  onChange: (selected: MultiSelectDatum[]) => void; // Callback function called when the selection changes
  isFullWidth?: boolean;
  disabled?: boolean;
  placeholder?: string;
  customWidth?: string;
}

// Use React's forwardRef function to define our component.
// This allows us to forward a ref down to the underlying DOM element.
export const FancyMultiSelect = forwardRef<
  HTMLDivElement, // The type of the forwarded ref
  FancyMultiSelectProps // The type of the props
>(
  (
    {
      multiSelectData,
      isFullWidth,
      value,
      name,
      onChange,
      disabled = false,
      placeholder,
      customWidth,
    },
    ref,
  ) => {
    // Destructure the props and the ref

    // State hook for tracking whether the multi-select dropdown is open or not
    const [isOpen, setIsOpen] = useState(false);

    // useCallback hook for creating a memoized version of the handleUnselect function
    const handleUnselect = useCallback(
      // This function will be called with the datum to unselect
      (datum: MultiSelectDatum) => {
        // Call the onChange callback with the value array,
        // filtering out the datum that we want to unselect
        onChange(
          value.filter((s: MultiSelectDatum) => s.value !== datum.value),
        );
      },
      // The dependencies of this callback are value and onChange
      [value, onChange],
    );

    // useMemo hook for calculating the selectable values
    const selectables = useMemo(() => {
      return multiSelectData.filter((datum1) => {
        // Filter out the options that are already selected
        return !value.some((datum2) => datum2.value === datum1.value);
      });
    }, [multiSelectData, value]); // The dependencies of this memoization are multiSelectData and value

    // Utilize React's useMemo hook to memoize the computed placeholder text.
    // This ensures that we only recompute the placeholder text when necessary,
    // thereby optimizing performance.
    const placeholderText = useMemo(() => {
      // Case 1: If no value is selected and no default placeholder is provided,
      // generate a placeholder using the field name.
      if (value.length === 0 && !placeholder) {
        return `Select ${name}...`;
      }

      // Case 2: If the field is disabled and a placeholder is provided,
      // use the provided placeholder text.
      if (disabled && placeholder) {
        return placeholder;
      }

      // Default Case: Return null if none of the above conditions are met.
      return null;
    }, [value, name, disabled, placeholder]); // Re-compute only when these dependencies change.

    const getWidthClass = (width: string | undefined) => {
      return width ? `w-[${width}]` : '';
    };

    // The component return value begins here
    return (
      <Command
        ref={ref}
        role='combobox' // Indicate that this is a combobox
        aria-haspopup='listbox' // Indicate that this combobox pops up a listbox
        aria-expanded={isOpen} // Indicate whether the listbox is currently expanded
        className={cn(
          'overflow-visible bg-root-foreground backdrop-blur-lg backdrop-brightness-150',
          {
            'pointer-events-none cursor-pointer opacity-50': disabled,
            'max-w-md': !isFullWidth,
            'w-full': isFullWidth,
          },
          getWidthClass(customWidth),
        )}
      >
        <div className='group min-h-10 rounded-md border border-input bg-root px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'>
          <div className={`flex flex-wrap gap-1 ${value.length ? 'mb-2' : ''}`}>
            {value.map((datum: MultiSelectDatum) => {
              // For each selected value, render a badge with the label and a remove button
              return (
                <Badge
                  key={datum.value}
                  className='py-1 pl-2 pr-1'
                  role='listitem' // Indicate that this badge is a list item
                >
                  <Paragraph className='text-xs font-semibold text-root'>
                    {datum.label}
                  </Paragraph>
                  <Button
                    className='-my-2 ml-1 h-4 w-fit rounded-full bg-transparent px-0.5 py-0 outline-none ring-offset-background hover:bg-transparent focus:ring-2 focus:ring-ring focus:ring-offset-2'
                    // variant="outline"
                    aria-label={`Remove ${datum.label}`} // Describe the action of this button
                    aria-disabled={disabled} // Indicate whether this button is disabled
                    disabled={disabled}
                    onKeyDown={(e) => {
                      // Call the handleUnselect function when the Enter key is pressed on a selected value
                      if (e.key === 'Enter') {
                        handleUnselect(datum);
                      }
                    }}
                    onMouseDown={(e) => {
                      // Prevent default mouse down event and propagation
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => {
                      // Call the handleUnselect function when a selected value is clicked
                      handleUnselect(datum);
                    }}
                  >
                    <XIcon className='size-4 bg-transparent text-root hover:bg-transparent hover:text-destructive-foreground/80 focus:text-destructive-foreground active:bg-transparent' />
                  </Button>
                </Badge>
              );
            })}
          </div>
          <CommandInputUnstyled
            onBlur={() => {
              setIsOpen(false);
            }} // Close the dropdown when the input loses focus
            // eslint-disable-next-line react/jsx-sort-props
            onFocus={() => {
              setIsOpen(true);
            }} // Open the dropdown when the input gets focus
            // placeholder={`Search ${name}...`} // Placeholder text for the input
            placeholder={placeholder ? placeholder : `Search ${name}...`}
            aria-placeholder={
              placeholderText ? placeholderText : `Search ${name}...`
            }
            aria-autocomplete='list' // Indicate that this input supports list-based autocompletion
            aria-controls={`${name}-listbox`} // Indicate that this input controls the listbox
            aria-disabled={disabled} // Indicate whether this input is disabled
            disabled={disabled}
          />
        </div>

        <div className='relative translate-y-2'>
          {isOpen && selectables.length > 0 ? (
            <ScrollArea className='max-h-96' asChild>
              <div
                className='absolute top-0 z-[999] w-full rounded-md border bg-root/95 text-foreground shadow-md outline-none backdrop-blur-lg animate-in'
                role='listbox' // Indicate that this div is a listbox
                id={`${name}-listbox`} // Provide an ID so this listbox can be associated with its controlling input
              >
                <CommandEmpty>{`No ${name} found`}</CommandEmpty>
                {/* ugh, yeah something with position absolute is messing with the scroll area, need to revert to default scroll */}

                <CommandGroup>
                  {selectables.map((datum, i) => {
                    // For each selectable value, render a command item
                    return (
                      <CommandItem
                        key={datum.value}
                        role='option' // Indicate that this command item is an option in a listbox
                        aria-selected={i === 0} // Indicate whether this option is selected
                        onMouseDown={(e) => {
                          // Prevent default mouse down event and propagation
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={() => {
                          // Call the onChange callback with the new selection when an option is selected
                          onChange([...value, datum]);
                        }}
                      >
                        {datum.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </div>
            </ScrollArea>
          ) : null}
        </div>
      </Command>
    );
  },
);

// Assign a display name to our component for better debugging
FancyMultiSelect.displayName = 'FancyMultiSelect';
