import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './pages/Layout';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Users } from './pages/Users';
import { Subscriptions } from './pages/Subscriptions';
import { Tokens } from './pages/Tokens';
import { Workers } from './pages/Workers';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/tokens" element={<Tokens />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
