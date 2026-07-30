import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function Settings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">تنظیمات سیستم</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 mb-4">تنظیمات تلگرام</h3>
        <Input label="توکن ربات تلگرام (مخفی)" type="password" placeholder="********" dir="ltr" />
        <Button>ذخیره تنظیمات</Button>
      </div>
    </div>
  );
}
