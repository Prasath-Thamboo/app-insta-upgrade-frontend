import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import PasswordField, { usePasswordChecks, PASSWORD_POLICY } from '../components/PasswordField';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isValid: isPwdValid } = usePasswordChecks(password);

  const topRight = <span>Déjà inscrit ? <Link to="/login">Se connecter</Link></span>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (consent !== true) {
      setMessage("Vous devez accepter pour continuer l'inscription.");
      return;
    }
    if (!isPwdValid) {
      setMessage(PASSWORD_POLICY);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Inscription réussie. Veuillez vérifier votre email.');
        setSubmitted(true);
      } else {
        throw new Error(data.message || 'Erreur lors de l’inscription');
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Étape 1 : vérification du type de compte Instagram
  if (consent === null) {
    return (
      <AuthLayout topRight={topRight}>
        <span className="badge badge--brand">Étape 1 sur 2</span>
        <h1 style={{ marginTop: 14 }}>Votre compte Instagram</h1>
        <p>Count-inst utilise l’API officielle de Meta, qui nécessite un compte Instagram <strong>professionnel</strong> (Créateur ou Entreprise).</p>
        <div className="choice-grid">
          <button type="button" className="choice" onClick={() => setConsent(true)}>
            <span className="choice__icon">✅</span>
            <span>
              <strong>Oui, j’ai un compte professionnel</strong>
              <small>Je continue la création de mon compte.</small>
            </span>
          </button>
          <button type="button" className="choice" onClick={() => setConsent(false)}>
            <span className="choice__icon">🤔</span>
            <span>
              <strong>Non, ou je ne sais pas</strong>
              <small>Je découvre comment passer en compte pro.</small>
            </span>
          </button>
        </div>
      </AuthLayout>
    );
  }

  if (consent === false) {
    return (
      <AuthLayout topRight={topRight}>
        <h1>Passez en compte professionnel</h1>
        <p>C’est gratuit et rapide. Dans l’application Instagram :</p>
        <ol className="steps-list" style={{ marginBottom: 24 }}>
          <li><h3>Ouvrez les paramètres</h3><p>Profil → menu ☰ → Paramètres et confidentialité.</p></li>
          <li><h3>Type de compte</h3><p>« Type de compte et outils » → « Passer à un compte professionnel ».</p></li>
          <li><h3>Revenez ici</h3><p>Une fois terminé, reprenez votre inscription.</p></li>
        </ol>
        <div className="stack">
          <button type="button" className="btn btn--primary btn--lg btn--block" onClick={() => setConsent(true)}>
            C’est fait, je continue
          </button>
          <Link to="/get-instagram-token" className="btn btn--block">Voir le guide complet</Link>
          <button type="button" className="btn btn--ghost btn--block" onClick={() => setConsent(null)}>← Retour</button>
        </div>
      </AuthLayout>
    );
  }

  if (submitted) {
    return (
      <AuthLayout topRight={topRight}>
        <div className="center">
          <div className="status-card__icon status-card__icon--success">✉️</div>
          <h1>Vérifiez votre boîte mail</h1>
          <p>{message} Cliquez sur le lien reçu pour activer votre compte, puis connectez-vous.</p>
          <Link to="/login" className="btn btn--primary btn--lg btn--block">Aller à la connexion</Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout topRight={topRight}>
      <span className="badge badge--brand">Étape 2 sur 2</span>
      <h1 style={{ marginTop: 14 }}>Créer votre compte</h1>
      <p>7 jours d’essai gratuit, sans carte bancaire.</p>

      <form onSubmit={handleSubmit} className="form">
        {message && <div className="alert alert--error" role="alert">{message}</div>}

        <div className="field">
          <label className="field__label" htmlFor="email">Email</label>
          <input id="email" className="input" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" autoComplete="email" required />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="username">Nom d’utilisateur</label>
          <input id="username" className="input" type="text" value={username}
            onChange={(e) => setUsername(e.target.value)} placeholder="ma.marque" autoComplete="username" required />
        </div>

        <PasswordField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showStrength
          autoComplete="new-password"
        />

        <button type="submit" className="btn btn--grad btn--lg btn--block" disabled={!isPwdValid || loading}>
          {loading ? <span className="spinner spinner--sm" /> : 'Créer mon compte'}
        </button>
        <p className="muted center" style={{ fontSize: '.82rem', margin: 0 }}>
          En créant un compte, vous acceptez nos <Link to="/conditions-utilisation">conditions d’utilisation</Link>.
        </p>
      </form>
    </AuthLayout>
  );
}
