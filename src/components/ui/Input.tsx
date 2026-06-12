import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              {icon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={`w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all duration-300
              ${icon ? 'pl-11' : ''}
              ${error 
                ? 'border-rose-300 focus:ring-2 focus:ring-rose-500/20' 
                : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
              }
              dark:bg-slate-900 dark:border-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <span className="block text-xs font-semibold text-rose-500 dark:text-rose-400">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
