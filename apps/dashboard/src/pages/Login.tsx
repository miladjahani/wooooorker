import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Alert } from '../components/Alert';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Minimal mock for now. In reality, call fetch('/api/auth/login')
    if (email === 'admin@admin.com' && password === 'admin123') {
      localStorage.setItem('token', 'mock_token');
      navigate('/');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">ورود به سیستم</h2>
        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="ایمیل"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            dir="ltr"
          />
          <Input
            label="رمز عبور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            dir="ltr"
          />
          <Button type="submit" className="w-full">ورود</Button>
        </form>
      </div>
    </div>
  );
}
