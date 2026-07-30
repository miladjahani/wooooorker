import { Alert } from '../components/Alert';

export function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">داشبورد</h1>
      <Alert type="info">به سیستم مدیریت اشتراک‌ها خوش آمدید.</Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['کاربران فعال', 'اشتراک‌ها', 'توکن‌ها', 'ورکرهای آنلاین'].map((title, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
            <p className="text-3xl font-bold mt-2">{Math.floor(100) + 10}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
