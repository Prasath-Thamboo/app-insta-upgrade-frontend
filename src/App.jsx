import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import ConnectInstagram from './ConnectInstagram';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Footer from './Footer';
import Profile from './Profile';
import AdminDashboard from './AdminDashboard';
import EditUser from './EditUser';
import ChangeRole from './ChangeRole';
import EmailConfirmation from './EmailConfirmation';
import StripeCheckout from './StripeCheckout';
import PaymentSuccess from './PaymentSuccess';
import PaymentCancelled from './PaymentCancelled';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import InstagramCallback from './InstagramCallback';
import GetInstaToken from './GetInstaToken'; 
import Contact from './Contact';
import StartTrial from './StartTrial';
import Loader from './Loader';
import Home from './Home';


import PrivacyPolicy from './PrivacyPolicy';
import LegalNotice from './LegalNotice';
import TermsAndConditions from './TermsAndConditions';
import CookiesPolicy from './CookiesPolicy';

import CookieBanner from './CookieBanner'; 
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
        <Route path="/home" element={<Home />} />
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
