import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/App.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [consent, setConsent] = useState(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Règle: 12+ caractères, ≥1 majuscule, ≥1 caractère spécial
  const checks = useMemo(() => ({
    length: password.length >= 12,
    upper: /[A-Z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }), [password]);

  const score = (checks.length ? 1 : 0) + (checks.upper ? 1 : 0) + (checks.special ? 1 : 0);
  const scorePct = [0, 33, 66, 100][score];
  const isPwdValid = score === 3;

  const barColor = score === 0 ? '#9aa0a6' // gris
                  : score === 1 ? '#ff9800' // orange
                  : score === 2 ? '#ff9800'
                  : '#27ae60';             // vert

  const policyMsg = "Le mot de passe doit contenir au minimum 12 caractères, au moins une majuscule et un caractère spécial.";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (consent !== true) {
      setMessage("Vous devez accepter pour continuer l'inscription.");
      return;
    }
    if (!isPwdValid) {
      setMessage(policyMsg);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Inscription réussie. Veuillez vérifier votre email.");
        setSubmitted(true);
      } else {
        throw new Error(data.message || "Erreur lors de l’inscription");
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Étape consentement
  if (consent === null) {
    return (
      <div className="body-sim" style={{ flexDirection: 'column', padding: 20 }}>
        <h1 style={{ marginBottom: 20 }}>Avez-vous un compte Instagram Professionnel ?</h1>
        <div>
          <button onClick={() => setConsent(true)} style={{ marginRight: 10 }}>Oui</button>
          <button onClick={() => setConsent(false)} style={{ backgroundColor: 'tomato', color: 'white' }}>Non</button>
        </div>
      </div>
    );
  }

  if (consent === false) {
    return (
      <div className="body-sim" style={{ textAlign: 'center', paddingInline: 20 }}>
        <h1>
          Nous vous conseillons de créer un compte Professionnel avant de débuter l'inscription et de suivre les
          instructions de cette page :{' '}
          <Link to="/get-instagram-token"><strong>OBTENIR LE TOKEN INSTAGRAM</strong></Link>
        </h1>
        <button onClick={() => setConsent(null)} style={{ marginTop: 10 }}>Retour</button>
      </div>
    );
  }

  return (
    <div className="body-sim" style={{ paddingInline: 20 }}>
      <div style={{ maxWidth: 440, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 10, textAlign: 'center' }}>Créer un compte</h1>
        <p style={{ marginBottom: 24, color: 'var(--simple-color)', textAlign: 'center' }}>
          Remplissez les informations ci-dessous
        </p>

        {message && (
          <p style={{
            color: submitted ? '#27ae60' : '#e74c3c',
            marginBottom: 12,
            textAlign: 'center',
            fontWeight: 600
          }}>
            {message}
          </p>
        )}

        {!submitted ? (
          <form onSubmit={handleSubmit} className="login-form" style={{ display: 'grid', gap: 16 }}>
            {/* Email */}
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 14, color: 'var(--simple-color)' }}>Email de connexion</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email de connexion"
                required
              />
            </label>

            {/* Username */}
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 14, color: 'var(--simple-color)' }}>Nom d’utilisateur</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nom d’utilisateur"
                required
              />
            </label>

            {/* Mot de passe */}
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 14, color: 'var(--simple-color)' }}>Mot de passe</span>

              <div style={{ }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  required
                  aria-describedby="pwd-help pwd-meter"
                  style={{ width: '100%', paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  title={showPwd ? 'Masquer' : 'Afficher'}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 18,
                    lineHeight: 1
                  }}
                >
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>

              {/* Barre de progression */}
              <div id="pwd-meter" style={{ height: 8, background: 'rgba(0,0,0,0.15)', borderRadius: 999, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${scorePct}%`,
                    height: '100%',
                    background: barColor,
                    transition: 'width .25s ease'
                  }}
                />
              </div>

              {/* Checklist des règles */}
              <div
                id="pwd-help"
                style={{
                  fontSize: 13,
                  marginTop: 4,
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.06)',
                  color: 'var(--simple-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ color: checks.length ? '#27ae60' : '#e74c3c', fontWeight: 700 }}>
                    {checks.length ? '✔' : '✖'}
                  </span>
                  12 caractères minimum
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ color: checks.upper ? '#27ae60' : '#e74c3c', fontWeight: 700 }}>
                    {checks.upper ? '✔' : '✖'}
                  </span>
                  Au moins une majuscule
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: checks.special ? '#27ae60' : '#e74c3c', fontWeight: 700 }}>
                    {checks.special ? '✔' : '✖'}
                  </span>
                  Au moins un caractère spécial
                </div>
              </div>
            </label>

            <button
              type="submit"
              disabled={!isPwdValid}
              style={{
                padding: 12,
                backgroundColor: isPwdValid ? 'var(--main-color)' : '#9aa0a6',
                color: 'var(--simple-color2)',
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 8,
                cursor: isPwdValid ? 'pointer' : 'not-allowed'
              }}
            >
              S’inscrire
            </button>
          </form>
        ) : (
          <p style={{ fontSize: 18, marginTop: 20, textAlign: 'center' }}>
            Merci ! Un email de confirmation a été envoyé. Vérifiez votre boîte mail avant de vous connecter.
          </p>
        )}

        <p style={{ marginTop: 20, color: 'var(--simple-color)', textAlign: 'center' }}>
          Déjà un compte ? <Link to="/login"><strong>Connectez-vous</strong></Link>
        </p>
      </div>
    </div>
  );
}
