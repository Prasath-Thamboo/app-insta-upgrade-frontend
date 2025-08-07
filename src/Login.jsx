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
    <div className="body-sim2">
      {popup && <div className={`popup ${popup.type}`}>{popup.message}</div>}

      <h1 style={{ marginBottom: '10px' }}>Bienvenue au compteur de followers</h1>
      <p style={{ marginBottom: '20px', color:'black' }}>Connectez-vous juste en dessous</p>

      <img src="/insta-logo.png" alt="Logo Instagram" style={{ width: '100px', marginBottom: '20px' }} />

      <Link to="/register" style={{ marginBottom: '30px', textDecoration: 'none', color: '#007BFF' }}>
        <button style={{ padding: '8px 16px' }}>Créer un compte</button>
      </Link>

      <form onSubmit={handleSubmit} className="login-form" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          placeholder="Email ou nom d'utilisateur"
          required
          style={{border:'1px solid black'}}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
          style={{border:'1px solid black'}}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: 'var(--main-color)', color: 'var(--simple-color2)', fontSize: '16px' }}>
          Connexion
        </button>
        <p style={{ marginTop: '10px' }}>
          <Link to="/forgot-password">Mot de passe oublié ?</Link>
        </p>
      </form>
    </div>
  );
}
