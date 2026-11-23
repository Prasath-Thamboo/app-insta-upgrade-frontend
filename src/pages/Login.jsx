import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import PasswordField from '../components/PasswordField';

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        throw new Error(data.message || 'Identifiants incorrects');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout topRight={<span>Pas de compte ? <Link to="/register">S’inscrire</Link></span>}>
      <h1>Bon retour 👋</h1>
      <p>Connectez-vous pour retrouver votre compteur.</p>

      <form onSubmit={handleSubmit} className="form">
        {error && <div className="alert alert--error" role="alert">{error}</div>}

        <div className="field">
          <label className="field__label" htmlFor="identifier">Email ou nom d’utilisateur</label>
          <input
            id="identifier"
            className="input"
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            placeholder="vous@exemple.com"
            autoComplete="username"
            required
          />
        </div>

        <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} />

        <div style={{ textAlign: 'right', marginTop: -6 }}>
          <Link to="/forgot-password" style={{ fontSize: '.88rem' }}>Mot de passe oublié ?</Link>
        </div>

        <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={loading}>
          {loading ? <span className="spinner spinner--sm" /> : 'Se connecter'}
        </button>

        <div className="auth__divider">Nouveau sur Count-inst ?</div>
        <Link to="/register" className="btn btn--lg btn--block">Créer un compte gratuit</Link>
      </form>
    </AuthLayout>
  );
}
