import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-1 dark:text-gray-300">{label}</label>}
      <input
        className={`w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
