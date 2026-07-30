import React from 'react';

export function Alert({ type = 'info', children }: { type?: 'info' | 'error' | 'success', children: React.ReactNode }) {
  const styles = {
    info: 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    error: 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
    success: 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
  };

  return (
    <div className={`p-4 rounded-md border ${styles[type]} mb-4`}>
      {children}
    </div>
  );
}
