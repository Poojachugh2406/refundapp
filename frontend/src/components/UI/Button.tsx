
  import React from 'react';
  import { clsx } from 'clsx';
  import { RefreshCw } from 'lucide-react';

  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: React.ReactNode;
    gradient?: boolean;
  }

  const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    gradient = false,
    children,
    className,
    disabled,
    ...props
  }) => {
    const baseClasses = 'hover:cursor-pointer py-2 inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    // Variant styles with gradient option
    const variantClasses = {
      primary: gradient 
        ? 'bg-gradient-to-r from-orange-700 to-purple-700 text-white hover:from-orange-700 hover:to-purple-700 focus:ring-orange-500'
        : 'bg-orange-700 text-white hover:bg-orange-700 focus:ring-orange-500',
      secondary: 'bg-gray-700 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-orange-500',
      danger: 'bg-red-700 text-white hover:bg-red-700 focus:ring-red-500',
    };
    
    // Size styles
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm gap-1',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
    };

    // Border radius based on your examples
    const borderRadius = gradient ? 'rounded-xl' : 'rounded-md';

    return (
      <button
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          borderRadius,
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <RefreshCw 
            className={clsx(
              "animate-spin",
              size === 'sm' ? "h-4 w-4" : "h-4 w-4"
            )} 
          />
        )}
        {children}
      </button>
    );
  };

  export default Button;