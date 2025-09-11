import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import ConnectInstagram from './pages/ConnectInstagram';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Footer from './pages/Footer';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import EditUser from './pages/EditUser';
import ChangeRole from './pages/ChangeRole';
import EmailConfirmation from './pages/EmailConfirmation';
import StripeCheckout from './pages/StripeCheckout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancelled from './pages/PaymentCancelled';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import InstagramCallback from './pages/InstagramCallback';
import GetInstaToken from './pages/GetInstaToken'; 
import Contact from './pages/Contact';
import StartTrial from './pages/StartTrial';
import Loader from './pages/Loader';


import PrivacyPolicy from './pages/PrivacyPolicy';
import LegalNotice from './pages/LegalNotice';
import TermsAndConditions from './pages/TermsAndConditions';
import CookiesPolicy from './pages/CookiesPolicy';

import CookieBanner from './pages/CookieBanner'; 
import { loadGoogleAnalytics } from './utils/analytics.js';

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem('token');
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/me`, {
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

  if (authorized === null) return <Loader />;
  if (!authorized) return <Navigate to="/login" />;
  return children;
}

function App() {
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent === 'true') {
      loadGoogleAnalytics();
    }
  }, []);

  return (
    <Router>
      <Routes>

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/get-instagram-token" element={<GetInstaToken />} />
        <Route path="/instagram-callback" element={<InstagramCallback />} />
        <Route path="/connect-instagram" element={<ConnectInstagram />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<EmailConfirmation />} />

        {/* Stripe Paiement */}
        <Route path="/subscribe" element={<StripeCheckout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancelled" element={<PaymentCancelled />} />

        {/* Utilisateur */}
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
        <Route
          path="/start-trial"
          element={
            <ProtectedRoute>
              <StartTrial />
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

        {/* Pages légales RGPD */}
        <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
        <Route path="/mentions-legales" element={<LegalNotice />} />
        <Route path="/conditions-utilisation" element={<TermsAndConditions />} />
        <Route path="/cookiesPolicy" element={<CookiesPolicy />} />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>

      {/* ✅ Bannière cookies affichée en bas de page */}
      <CookieBanner />

      {/* ✅ Footer toujours affiché */}
      <Footer />
    </Router>
  );
}

export default App;
