import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
  error?: string;
}

export function Select({ label, options, error, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-1 dark:text-gray-300">{label}</label>}
      <select
        className={`w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
