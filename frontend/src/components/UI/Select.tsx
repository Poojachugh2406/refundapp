import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { clsx } from 'clsx';

interface SelectOption {
  value: string;
  label: string;
}

export interface SearchableSelectProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  value?: string;
  name?: string;
  onChange: (value: string) => void;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
  id?: string;
  // Note: 'ref' is removed here because forwardRef handles it
}

const SearchableSelect = forwardRef<HTMLInputElement, SearchableSelectProps>(
  (
    {
      label,
      required = false,
      error,
      helperText,
      options,
      placeholder = "Select an option",
      icon,
      value, // This is the ID/Value from the form
      onChange,
      className,
      labelClassName,
      disabled = false,
      id,
      name,
    },
    ref // This ref comes from react-hook-form (via Controller)
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    // Sync internal search term (label) when the external value (ID) changes
    useEffect(() => {
      const selectedOption = options.find((opt) => opt.value === value);
      if (selectedOption) {
        setSearchTerm(selectedOption.label);
      } else if (!value) {
        setSearchTerm('');
      }
    }, [value, options]);

    // Handle clicking outside to close
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          // Revert text to match the currently selected value if user didn't pick a new one
          const selectedOption = options.find((opt) => opt.value === value);
          setSearchTerm(selectedOption ? selectedOption.label : '');
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [value, options]);

    // Filter options
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option: SelectOption) => {
      onChange(option.value); // Update form with value (ID)
      setSearchTerm(option.label); // Update display with Label
      setIsOpen(false);
    };

    return (
      <div className="space-y-2" ref={wrapperRef}>
        {label && (
          <label
            htmlFor={selectId}
            className={clsx("flex items-center text-sm font-medium text-gray-700", labelClassName)}
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <div className="h-5 w-5 text-gray-400">{icon}</div>
            </div>
          )}

          {/* The Input acts as the Search + Display */}
          <input
            ref={ref} // Attach the form ref here so focus works on error
            id={selectId}
            name={name}
            type="text"
            autoComplete="off"
            disabled={disabled}
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
              if (e.target.value === '') onChange(''); // Clear form value if text is cleared
            }}
            onClick={() => !disabled && setIsOpen(true)}
            className={clsx(
              'w-full px-4 py-2 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white',
              {
                'pl-10': icon,
                'border-red-300 bg-red-50 focus:border-red-500': error,
                'border-gray-200 focus:border-blue-500 hover:border-gray-300': !error,
                'opacity-50 cursor-not-allowed bg-gray-100': disabled,
              },
              className
            )}
          />

          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={() => !disabled && setIsOpen(!isOpen)}
          >
            <svg
              className={clsx("h-5 w-5 transition-transform duration-200 text-gray-400", {
                "transform rotate-180": isOpen
              })}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>

          {isOpen && !disabled && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
              {filteredOptions.length > 0 ? (
                <ul className="py-1">
                  {filteredOptions.map((option) => (
                    <li
                      key={option.value}
                      onClick={() => handleSelect(option)}
                      className={clsx(
                        "px-4 py-2 cursor-pointer text-sm transition-colors duration-150",
                        "hover:bg-blue-50 hover:text-blue-700",
                        { "bg-blue-50 text-blue-700 font-medium": option.value === value }
                      )}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No options found
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-600 rounded-full"></span>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

SearchableSelect.displayName = "SearchableSelect";

export default SearchableSelect;