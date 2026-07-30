import React from 'react';

interface TableProps {
  columns: string[];
  children: React.ReactNode;
}

export function Table({ columns, children }: TableProps) {
  return (
    <div className="overflow-x-auto w-full border dark:border-gray-700 rounded-lg">
      <table className="w-full text-right">
        <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-4 py-3 text-sm font-semibold">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-gray-700 bg-white dark:bg-gray-900">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{children}</tr>;
}

export function TableCell({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`px-4 py-3 text-sm ${className || ""}`} {...props}>{children}</td>;
}
