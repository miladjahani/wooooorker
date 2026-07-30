import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-800">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
            ✕
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
