import { Link, useLocation } from 'react-router-dom';
import { Home, Users, CreditCard, Key, Server, Settings } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'داشبورد', icon: Home },
    { path: '/users', label: 'کاربران', icon: Users },
    { path: '/subscriptions', label: 'اشتراک‌ها', icon: CreditCard },
    { path: '/tokens', label: 'توکن‌ها', icon: Key },
    { path: '/workers', label: 'ورکرها', icon: Server },
    { path: '/settings', label: 'تنظیمات', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-900 border-l dark:border-gray-800 sticky top-0 hidden md:block">
      <div className="p-6 font-bold text-xl border-b dark:border-gray-800">
        CF Platform
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
