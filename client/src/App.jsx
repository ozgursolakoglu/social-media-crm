import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './services/api';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Compose from './pages/Compose';
import Calendar from './pages/Calendar';
import Scheduled from './pages/Scheduled';
import Posts from './pages/Posts';
import Platforms from './pages/Platforms';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await auth.me();
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading…
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app">
        {user && <Navbar user={user} onLogout={() => { localStorage.removeItem('token'); setUser(null); }} />}
        <Routes>
          {!user && <Route path="/login" element={<Login />} />}
          {!user && <Route path="/" element={<Navigate to="/login" replace />} />}
          {user && <Route path="/" element={<Navigate to="/dashboard" replace />} />}
          {user && (
            <>
              <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
              <Route path="/compose" element={<ProtectedRoute user={user}><Compose /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute user={user}><Calendar /></ProtectedRoute>} />
              <Route path="/scheduled" element={<ProtectedRoute user={user}><Scheduled /></ProtectedRoute>} />
              <Route path="/posts" element={<ProtectedRoute user={user}><Posts /></ProtectedRoute>} />
              <Route path="/platforms" element={<ProtectedRoute user={user}><Platforms /></ProtectedRoute>} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
