import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Basic logout handling
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="h-16 border-b dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-6 sticky top-0 z-10">
      <h2 className="font-semibold text-lg">داشبورد مدیریت</h2>
      <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-md transition-colors">
        <LogOut size={18} />
        <span className="text-sm">خروج</span>
      </button>
    </header>
  );
}
