import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Profile from './Profile';
import AdminDashboard from './AdminDashboard';
import EditUser from './EditUser';
import ChangeRole from './ChangeRole';
import EmailConfirmation from './EmailConfirmation'; // ✅ Import du composant

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem('token');
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (adminOnly && res.data.role !== 'admin') {
          setAuthorized(false);
        } else {
          setAuthorized(true);
        }
      } catch {
        setAuthorized(false);
      }
    };

    if (token) {
      checkAuth();
    } else {
      setAuthorized(false);
    }
  }, [token, adminOnly]);

  if (authorized === null) return <p>Chargement...</p>;
  if (!authorized) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Route de confirmation d'email */}
        <Route path="/verify-email" element={<EmailConfirmation />} />

        {/* Utilisateurs */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit/:id"
          element={
            <ProtectedRoute adminOnly={true}>
              <EditUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/role/:id"
          element={
            <ProtectedRoute adminOnly={true}>
              <ChangeRole />
            </ProtectedRoute>
          }
        />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
