import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';
import PasswordField, { usePasswordChecks, PASSWORD_POLICY } from '../components/PasswordField';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { isValid: isPwdValid } = usePasswordChecks(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSuccess(false);

    if (!isPwdValid) {
      setMessage(PASSWORD_POLICY);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reset-password/${token}`,
        { newPassword }
      );
      setMessage(res.data.message || 'Mot de passe réinitialisé.');
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur');
      setIsSuccess(false);
    }
  };

  return (
    <AuthLayout topRight={<Link to="/login">← Retour à la connexion</Link>}>
      <h1>Nouveau mot de passe</h1>
      <p>Choisissez un mot de passe sécurisé pour votre compte.</p>

      <form onSubmit={handleSubmit} className="form">
        {message && (
          <div className={`alert ${isSuccess ? 'alert--success' : 'alert--error'}`} role="status">
            {message}{isSuccess && ' Redirection vers la connexion…'}
          </div>
        )}

        <PasswordField
          id="new-password"
          label="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          showStrength
          autoComplete="new-password"
        />

        <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={!isPwdValid}>
          Réinitialiser le mot de passe
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
