// Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (error) {
      setPopup({ message: error.message, type: 'decrease' });
      setTimeout(() => setPopup(null), 3000);
    }
  };

  return (
    <div className="auth-layout">
      {/* Colonne gauche — Présentation */}
      <section className="hero-panel">
        <div className="hero-content">
          <div className="brand">
            <img src="/insta-logo.png" alt="Instagram Logo" className="brand-logo" />
            <span className="brand-name">Count-inst</span>
          </div>

          <h1 className="hero-title">Compteur de followers <br />en temps réel</h1>
          <p className="hero-subtitle">
            Suivez les variations instantanément, affichez un compteur stylé pour vos vitrines
            ou dashboards, et restez focus sur l’essentiel.
          </p>

          <ul className="features">
            <li>
              <span className="feat-ico">⚡</span>
              <div>
                <strong>Temps réel</strong>
                <p>Mise à jour périodique & popup gain/perte intégrée.</p>
              </div>
            </li>
            <li>
              <span className="feat-ico">🎛️</span>
              <div>
                <strong>Designs multiples</strong>
                <p>Plusieurs styles d’affichage pour vos clients.</p>
              </div>
            </li>
            <li>
              <span className="feat-ico">🛡️</span>
              <div>
                <strong>Pro & RGPD</strong>
                <p>Respect du vie privée </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Colonne droite — Connexion */}
      <section className="auth-panel">
        <div className="auth-card">
          {popup && <div className={`popup ${popup.type}`}>{popup.message}</div>}

          <h1 style={{ marginBottom: '10px' }}>Bienvenue au compteur de followers</h1>
          <p style={{ marginBottom: '20px', color: 'black' }}>
            Connectez-vous juste en dessous
          </p>

          <img
            src="/insta-logo.png"
            alt="Logo Instagram"
            style={{ width: '64px', marginBottom: '16px' }}
          />

          <Link
            to="/register"
            style={{ marginBottom: '20px', textDecoration: 'none', color: 'var(--main-color)' }}
          >
            <button className="btn-secondary">Créer un compte</button>
          </Link>

          <form
            onSubmit={handleSubmit}
            className="login-form"
            style={{
              width: '100%',
              maxWidth: '400px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <label className="sr-only" htmlFor="identifier">Email ou nom d'utilisateur</label>
            <input
              id="identifier"
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Email ou nom d'utilisateur"
              required
              className="input"
            />

            <label className="sr-only" htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
              className="input"
            />

            <button type="submit" className="btn-primary">
              Connexion
            </button>

            <p style={{ marginTop: '10px' }}>
              <Link to="/forgot-password">Mot de passe oublié ?</Link>
            </p>
          </form>
        </div>
        <footer className="auth-footer">
          © {new Date().getFullYear()} Live IG Followers — Tous droits réservés
        </footer>
      </section>
    </div>
  );
}
