import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('https://ig-counter-backend.onrender.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } else {
      setPopup({ message: data.message || 'Identifiants incorrects', type: 'decrease' });
      setTimeout(() => setPopup(null), 3000);
    }
  };

  return (
    <>
      {popup && <div className={`popup ${popup.type}`}>{popup.message}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        <h1>Bienvenue au compteur de followers</h1>
        <p>Connectez-vous juste en dessous</p>
        <img src="/insta-logo.png" alt="Logo Instagram" style={{ width: '100px', margin: '20px 0' }} />

        <div className="form-group">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Identifiant"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
          <button type="submit">Connexion</button>
        </div>
      </form>
    </>
  );
}
