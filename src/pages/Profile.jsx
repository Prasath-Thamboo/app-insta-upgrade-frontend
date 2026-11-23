import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import PasswordField, { usePasswordChecks, PASSWORD_POLICY } from '../components/PasswordField';

const PLACEHOLDER = '/insta-logo2.png';

export default function Profile() {
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success'); // 'success' | 'error'
  const [showConfirm, setShowConfirm] = useState(false);
  const [style, setStyle] = useState('classic');
  const [instagramToken, setInstagramToken] = useState('');
  const [role, setRole] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('preferences'); // 'preferences' | 'subscription' | 'account'
  const [imgError, setImgError] = useState(false);
  const [busy, setBusy] = useState(false);

  const fileInputRef = useRef(null);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Messages
  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
  };

  // Auto-disparition du message après 4s
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => setMessage(''), 4000);
    return () => clearTimeout(id);
  }, [message]);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(res.data.username);
        setNewUsername(res.data.username);
        setProfilePicture(res.data.profilePicture || '');
        setStyle(res.data.dashboardStyle || 'classic');
        setRole(res.data.role);
        setInstagramToken(res.data.instagramToken || '');
        setIsSubscribed(!!res.data.isSubscribed);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUserData();
  }, [token]);

  const { isValid: isPwdValid } = usePasswordChecks(password);
  const policyMsg = PASSWORD_POLICY;

  // --- Handlers ---
  const handleUsernameChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/update-username`,
        { username: newUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsername(newUsername);
      showMessage("Nom d'utilisateur mis à jour.", 'success');
    } catch (err) {
      console.error(err);
      showMessage("Erreur lors de la mise à jour du nom d'utilisateur", 'error');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!isPwdValid) {
      showMessage(policyMsg, 'error');
      return;
    }
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/update-password`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPassword('');
      showMessage('Mot de passe mis à jour.', 'success');
    } catch (err) {
      console.error(err);
      showMessage("Erreur lors de la mise à jour du mot de passe", 'error');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/delete-account`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error(err);
      showMessage("Erreur lors de la suppression du compte", 'error');
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!file) return showMessage('Veuillez sélectionner une image.', 'error');
    const formData = new FormData();
    formData.append('image', file);

    try {
      setBusy(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload-profile-picture`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfilePicture(res.data.url); // URL Cloudinary versionnée
      setImgError(false);
      showMessage('Photo de profil mise à jour.', 'success');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setFile(null);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 415) {
        showMessage('Formats autorisés: JPG, PNG, WEBP', 'error');
      } else {
        showMessage("Erreur lors de l'upload de l'image.", 'error');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setBusy(true);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/delete-profile-picture`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfilePicture('');
      setImgError(false);
      showMessage('Photo de profil supprimée.', 'success');
    } catch (err) {
      console.error(err);
      showMessage("Erreur lors de la suppression de la photo.", 'error');
    } finally {
      setBusy(false);
    }
  };

  const updateStyle = async (next = style) => {
    setStyle(next);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/update-style`,
        { dashboardStyle: next },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage('Style mis à jour.', 'success');
    } catch {
      showMessage('Erreur lors de la mise à jour du style', 'error');
    }
  };

  const handleInstagramTokenChange = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/token`,
        { instagramToken },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage('Token Instagram mis à jour.', 'success');
    } catch (err) {
      console.error(err);
      showMessage("Erreur lors de la mise à jour du token Instagram. Pour le supprimer, entrez un espace puis validez.", 'error');
    }
  };

  const handleOpenCustomerPortal = async () => {
    try {
      setPortalLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/stripe/create-customer-portal-session`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      showMessage("Impossible d'ouvrir le portail d'abonnement.", 'error');
    } finally {
      setPortalLoading(false);
    }
  };

  const avatarSrc = !imgError && profilePicture ? profilePicture : PLACEHOLDER;

  const THEMES = [
    { id: 'classic', label: 'Classique' },
    { id: 'modern', label: 'Moderne' },
    { id: 'minimal', label: 'Minimal' },
    { id: 'neon', label: 'Néon' },
    { id: 'glass', label: 'Glass' },
  ];

  const TABS = [
    { id: 'preferences', label: '🎨 Préférences' },
    { id: 'subscription', label: '💳 Abonnement', hidden: !isSubscribed },
    { id: 'account', label: '🔐 Compte & sécurité' },
  ];

  return (
    <PageLayout back={{ to: '/dashboard', label: 'Retour au compteur' }}>
      <div className="page__head profile-head">
        <img src={avatarSrc} alt="Photo de profil" onError={() => setImgError(true)} className="avatar avatar--lg" loading="lazy" />
        <div>
          <h1>{username || 'Mon profil'}</h1>
          <div className="row">
            {isSubscribed
              ? <span className="badge badge--success">● Abonnement actif</span>
              : <span className="badge">Aucun abonnement</span>}
            {role && <span className="badge badge--brand">{role}</span>}
          </div>
        </div>
      </div>

      {message && (
        <div className={`alert ${messageType === 'error' ? 'alert--error' : 'alert--success'}`} role="status" aria-live="polite" style={{ marginBottom: 20 }}>
          {message}
          <button className="alert__close" onClick={() => setMessage('')} aria-label="Fermer la notification">×</button>
        </div>
      )}

      <div className="settings">
        <nav className="card settings__nav" role="tablist" aria-label="Paramètres du profil">
          {TABS.filter((t) => !t.hidden).map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeTab === t.id}
              className="settings__tab"
              onClick={() => { setActiveTab(t.id); setMessage(''); }}
            >
              {t.label}
            </button>
          ))}
          {!isSubscribed && (
            <Link to="/subscribe" className="btn btn--grad btn--sm" style={{ marginTop: 8 }}>Passer Premium</Link>
          )}
        </nav>

        <div className="settings__panel" role="tabpanel">
          {activeTab === 'preferences' && (
            <>
              <section className="card settings__section">
                <h2>Design du compteur</h2>
                <p>Choisissez l’apparence de votre écran. Le changement est enregistré immédiatement.</p>
                <div className="theme-picker">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className="theme-option"
                      aria-pressed={style === t.id}
                      onClick={() => updateStyle(t.id)}
                      disabled={busy}
                    >
                      <div className={`theme-option__swatch swatch--${t.id}`}>123</div>
                      {t.label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="card settings__section">
                <h2>Photo de profil</h2>
                <p>Elle s’affiche à côté de votre compteur. Formats acceptés : JPG, PNG, WEBP.</p>
                <form onSubmit={handleImageUpload} className="form">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="input"
                    onChange={(e) => setFile(e.target.files[0] || null)}
                  />
                  <div className="row">
                    <button type="submit" className="btn btn--primary" disabled={busy || !file}>
                      {busy ? 'Envoi…' : 'Mettre à jour la photo'}
                    </button>
                    {profilePicture && (
                      <button type="button" className="btn btn--danger-soft" onClick={handleDeleteAvatar} disabled={busy}>
                        Supprimer la photo
                      </button>
                    )}
                  </div>
                </form>
              </section>

              {(role === 'user' || role === 'testeur') && (
                <section className="card settings__section">
                  <h2>Connexion Instagram</h2>
                  <p>Le plus simple : utilisez la connexion automatique. Vous pouvez aussi coller un token manuellement.</p>
                  <Link to="/connect-instagram" className="btn btn--brand" style={{ marginBottom: 16 }}>Connecter avec Instagram</Link>
                  <form onSubmit={handleInstagramTokenChange} className="form">
                    <div className="field">
                      <label className="field__label" htmlFor="ig-token">Token Instagram (avancé)</label>
                      <input
                        id="ig-token"
                        className="input"
                        type="text"
                        value={instagramToken}
                        onChange={(e) => setInstagramToken(e.target.value)}
                        placeholder="Collez votre token Instagram"
                      />
                      <span className="field__hint">Pour supprimer le token, entrez un espace puis validez.</span>
                    </div>
                    <div><button type="submit" className="btn">Enregistrer le token</button></div>
                  </form>
                </section>
              )}
            </>
          )}

          {activeTab === 'subscription' && isSubscribed && (
            <section className="card settings__section">
              <h2>Abonnement Premium</h2>
              <p>Votre abonnement est <strong>actif</strong>. Résiliation, changement de carte, factures : tout se gère depuis le portail sécurisé Stripe.</p>
              <button type="button" className="btn btn--primary" onClick={handleOpenCustomerPortal} disabled={portalLoading}>
                {portalLoading ? 'Ouverture du portail…' : 'Gérer mon abonnement →'}
              </button>
            </section>
          )}

          {activeTab === 'account' && (
            <>
              <section className="card settings__section">
                <h2>Nom d’utilisateur</h2>
                <p>Le nom affiché dans votre espace.</p>
                <form onSubmit={handleUsernameChange} className="form">
                  <input className="input" type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required aria-label="Nom d’utilisateur" />
                  <div><button type="submit" className="btn btn--primary" disabled={newUsername === username}>Enregistrer</button></div>
                </form>
              </section>

              <section className="card settings__section">
                <h2>Mot de passe</h2>
                <p>Utilisez un mot de passe unique et robuste.</p>
                <form onSubmit={handlePasswordChange} className="form">
                  <PasswordField
                    id="new-password"
                    label="Nouveau mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    showStrength
                    autoComplete="new-password"
                  />
                  <div><button type="submit" className="btn btn--primary" disabled={!isPwdValid}>Changer le mot de passe</button></div>
                </form>
              </section>

              <section className="card settings__section settings__danger">
                <h2>Zone de danger</h2>
                <p>La suppression de votre compte est définitive et efface toutes vos données.</p>
                {!showConfirm ? (
                  <button type="button" className="btn btn--danger-soft" onClick={() => setShowConfirm(true)}>Supprimer mon compte</button>
                ) : (
                  <div className="confirm-box">
                    <p>⚠️ Cette action est irréversible. Voulez-vous vraiment supprimer votre compte ?</p>
                    <div className="row">
                      <button type="button" className="btn btn--danger" onClick={handleDeleteAccount}>Oui, supprimer</button>
                      <button type="button" className="btn" onClick={() => setShowConfirm(false)}>Annuler</button>
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
