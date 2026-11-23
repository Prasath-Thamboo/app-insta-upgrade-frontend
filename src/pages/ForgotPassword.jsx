import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/forgot-password`, { email });
      setSubmitted(true);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout topRight={<Link to="/login">← Retour à la connexion</Link>}>
      {submitted ? (
        <div className="center">
          <div className="status-card__icon status-card__icon--success">📩</div>
          <h1>Email envoyé</h1>
          <p>Si l’adresse est correcte, un lien de réinitialisation vous a été envoyé. Pensez à vérifier vos spams.</p>
          <Link to="/login" className="btn btn--primary btn--lg btn--block">Retour à la connexion</Link>
        </div>
      ) : (
        <>
          <h1>Mot de passe oublié ?</h1>
          <p>Indiquez votre email, nous vous envoyons un lien pour en choisir un nouveau.</p>
          <form onSubmit={handleSubmit} className="form">
            {error && <div className="alert alert--error" role="alert">{error}</div>}
            <div className="field">
              <label className="field__label" htmlFor="email">Adresse e-mail</label>
              <input id="email" className="input" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" required />
            </div>
            <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={loading}>
              {loading ? <span className="spinner spinner--sm" /> : 'Envoyer le lien'}
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
