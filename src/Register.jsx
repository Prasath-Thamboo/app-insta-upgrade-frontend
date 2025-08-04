import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Inscription réussie. Veuillez vérifier votre email.");
        setSubmitted(true); // Ne pas rediriger
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
        <h1 style={{ marginBottom: '20px' }}>Avez-vous un compte Instagram Professionnel ?</h1>
        <div>
          <button onClick={() => setConsent(true)} style={{ marginRight: '10px' }}>Oui</button>
          <button onClick={() => setConsent(false)} style={{ backgroundColor: 'tomato', color: 'white' }}>Non</button>
        </div>
      </div>
    );
  }

  if (consent === false) {
    return (
      <div className="body-sim2" style={{ textAlign: 'center' }}>
        <h1>Vous devez créer un compte Instagram Professionnel avant de procéder à l'inscription</h1>
        <button onClick={() => setConsent(null)} style={{ marginTop: '10px' }}>Retour</button>
      </div>
    );
  }

  return (
    <div className="body-sim2">
      <h1 style={{ marginBottom: '10px' }}>Créer un compte</h1>
      <p style={{ marginBottom: '20px', color:'var(--simple-color' }}>Remplissez les informations ci-dessous</p>

      {message && <p style={{ color: submitted ? 'green' : 'red', marginBottom: '10px' }}>{message}</p>}

      {!submitted ? (
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

          <button type="submit" style={{ padding: '10px', backgroundColor: 'var(--main-color)', color: 'var(--simple-color2)', fontSize: '16px' }}>
            S’inscrire
          </button>
        </form>
      ) : (
        <p style={{ fontSize: '18px', marginTop: '20px' }}>
          Merci ! Un email de confirmation a été envoyé. Vérifiez votre boîte mail avant de vous connecter.
        </p>
      )}

      <p style={{ marginTop: '20px', color:'var(--simple-color)' }}>
        Déjà un compte ? <Link to="/login"><strong>Connectez-vous</strong></Link>
      </p>
    </div>
  );
}
