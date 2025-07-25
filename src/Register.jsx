// Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [instaEmail, setInstaEmail] = useState('');
  const [instaPassword, setInstaPassword] = useState('');
  const [consent, setConsent] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (consent !== true) {
      setMessage("Vous devez accepter pour continuer l'inscription.");
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, instaEmail, instaPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        throw new Error(data.message || 'Erreur lors de l’inscription');
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (consent === null) {
    return (
      <div className="body-sim2" style={{ flexDirection: 'column', padding: '20px' }}>
        <h2 style={{ marginBottom: '20px' }}>Avez-vous un compte Instagram Professionel ?</h2>
        <div>
          <button onClick={() => setConsent(true)} style={{ marginRight: '10px' }}>Oui</button>
          <button onClick={() => setConsent(false)} style={{ backgroundColor: 'tomato', color: 'white' }}>Non</button>
        </div>
      </div>
    );
  }

  if (consent === false) {
    return (
      <div className="body-sim2" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Vous devez créer un compte Instagram Professionnel avant de procéder à l'inscription</h2>
        <button onClick={() => setConsent(null)} style={{ marginTop: '20px' }}>Retour</button>
      </div>
    );
  }

  return (
    <div className="body-sim2">
      <h1 style={{ marginBottom: '10px' }}>Créer un compte</h1>
      <p style={{ marginBottom: '20px' }}>Remplissez les informations ci-dessous</p>

      {message && <p style={{ color: 'red', marginBottom: '10px' }}>{message}</p>}

      <form onSubmit={handleSubmit} className="login-form" style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email de connexion"
          required
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nom d’utilisateur"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
        />
        <input
          type="email"
          value={instaEmail}
          onChange={(e) => setInstaEmail(e.target.value)}
          placeholder="Email Instagram"
          required
        />
        <input
          type="password"
          value={instaPassword}
          onChange={(e) => setInstaPassword(e.target.value)}
          placeholder="Mot de passe Instagram"
          required
        />

        <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', fontSize: '16px' }}>
          S’inscrire
        </button>
      </form>

      <p style={{ marginTop: '20px' }}>
        Déjà un compte ? <Link to="/login"><strong>Connectez-vous</strong></Link>
      </p>
    </div>
  );
}
