import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, placeholder, ...props }, ref) => {
    return (
      <select
        className={cn(
          'flex h-11 w-full rounded-xl border-2 bg-white px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 cursor-pointer appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236b7280%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E")] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10',
          error
            ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20'
            : 'border-gray-200 focus-visible:border-green-500 focus-visible:ring-green-500/20',
          className
        )}
        ref={ref}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);
Select.displayName = 'Select';

// Grouped Select for brands/categories
export interface SelectGroupedProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  groups: Array<{
    label: string;
    options: Array<{
      value: string;
      label: string;
      disabled?: boolean;
    }>;
  }>;
  placeholder?: string;
}

const SelectGrouped = React.forwardRef<HTMLSelectElement, SelectGroupedProps>(
  ({ className, error, groups, placeholder, ...props }, ref) => {
    return (
      <select
        className={cn(
          'flex h-11 w-full rounded-xl border-2 bg-white px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 cursor-pointer appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236b7280%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E")] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10',
          error
            ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20'
            : 'border-gray-200 focus-visible:border-green-500 focus-visible:ring-green-500/20',
          className
        )}
        ref={ref}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {groups.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    );
  }
);
SelectGrouped.displayName = 'SelectGrouped';

export { Select, SelectGrouped };
