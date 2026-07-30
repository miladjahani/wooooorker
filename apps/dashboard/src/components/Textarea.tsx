import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-1 dark:text-gray-300">{label}</label>}
      <textarea
        className={`w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
