import React, { useEffect, useState, useRef, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

const PLACEHOLDER = '/avatar-placeholder.png';

export default function Profile() {
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
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

  // === Vérifs mot de passe (front) ===
  // Règles: 12+ caractères, ≥1 majuscule, ≥1 caractère spécial
  const checks = useMemo(() => ({
    length: password.length >= 12,
    upper: /[A-Z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }), [password]);

  const score = (checks.length ? 1 : 0) + (checks.upper ? 1 : 0) + (checks.special ? 1 : 0);
  const scorePct = [0, 33, 66, 100][score];
  const isPwdValid = score === 3;
  const barColor = score === 0 ? '#9aa0a6' : score < 3 ? '#ff9800' : '#27ae60';
  const policyMsg = "Le mot de passe doit contenir au minimum 12 caractères, au moins une majuscule et un caractère spécial.";

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

  const updateStyle = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/update-style`,
        { dashboardStyle: style },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage('Style mis à jour.', 'success');
    } catch (err) {
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

  // --- UI helpers ---
  const TabButton = ({ id, label, hidden }) => {
    if (hidden) return null;
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => { setActiveTab(id); setMessage(''); }}
        aria-selected={isActive}
        role="tab"
        style={{
          padding: '10px 16px',
          border: 'none',
          borderBottom: isActive ? '3px solid var(--main-color)' : '3px solid transparent',
          background: 'transparent',
          fontWeight: isActive ? 'bold' : '600',
          color: 'var(--simple-color)',
          cursor: 'pointer',
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="body-sim">
      <div
        style={{
          maxWidth: '900px',
          width: '100%',
          margin: '50px',
          padding:'50px',
          borderRadius: '12px',
          boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
          height: '850px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap:'30px' }}>
          <div>
            <h1 style={{ margin: 0 }}>Profil utilisateur</h1>
            <p style={{ color: 'var(--simple-color)', marginTop: 6 }}>
              Connecté en tant que <strong>{username}</strong>
              {isSubscribed && (
                <span style={{ marginLeft: 8, fontWeight: '600' }}>
                  • Abonnement <span style={{ color: 'var(--main-color)' }}>actif</span>
                </span>
              )}
            </p>
          </div>
          <Link to="/dashboard">
            <button
              style={{
                color: 'white',
                padding: '10px 16px',
                backgroundColor: 'var(--main-color)',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: 8,
              }}
            >
              ← Retour au dashboard
            </button>
          </Link>
        </div>

        {/* Message */}
        {message && (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: 16,
              padding: '12px 18px',
              borderRadius: 8,
              fontWeight: 'bold',
              textAlign: 'center',
              border: '1px solid',
              background: messageType === 'error' ? 'rgba(231,76,60,0.15)' : 'rgba(46,204,113,0.15)',
              color: messageType === 'error' ? '#c0392b' : '#27ae60',
              borderColor: messageType === 'error' ? '#c0392b' : '#27ae60',
              position: 'relative'
            }}
          >
            {message}
            <button
              onClick={() => setMessage('')}
              aria-label="Fermer la notification"
              style={{
                position: 'absolute',
                right: 8,
                top: 6,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 18,
                lineHeight: 1,
                color: 'inherit'
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Avatar */}
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
          <img
            src={avatarSrc}
            alt="Profil"
            onError={() => setImgError(true)}
            style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover' }}
            loading="lazy"
          />
          {profilePicture && (
            <button
              onClick={handleDeleteAvatar}
              disabled={busy}
              style={{ background: 'var(--bg)', border: 'none', borderRadius: 8, padding: '8px 12px' }}
            >
              Supprimer la photo
            </button>
          )}
        </div>

        {/* Tabs */}
        <div role="tablist" aria-label="Paramètres du profil" style={{ display: 'flex', gap: 12, marginTop: 24, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <TabButton id="preferences" label="Préférences" />
          <TabButton id="subscription" label="Gestion de l’abonnement" hidden={!isSubscribed} />
          <TabButton id="account" label="Gestion du compte" />
        </div>

        {/* Panels */}
        <div style={{ marginTop: 24 }}>
          {/* Préférences */}
          {activeTab === 'preferences' && (
            <div role="tabpanel" aria-labelledby="preferences">
              {/* Design du dashboard */}
              <div style={{ marginBottom: 24 }}>
                <h2>Design du dashboard</h2>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',  justifyContent: 'center' }}>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    aria-label="Choisir le design du dashboard"
                    style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'var(--simple-color2)', color: 'var(--simple-color)' }}
                  >
                    <option value="classic">Classique</option>
                    <option value="modern">Moderne</option>
                    <option value="minimal">Minimal</option>
                    <option value="neon">Neon</option>
                    <option value="glass">Glassmorphism</option>
                  </select>
                  <button
                    onClick={updateStyle}
                    disabled={busy}
                    style={{ padding: '10px 16px', background: 'var(--bg)', border: 'none', fontWeight: 'bold', borderRadius: 8 }}
                  >
                    Enregistrer
                  </button>
                </div>
              </div>

              {/* Photo de profil */}
              <div style={{ marginBottom: 24 }}>
                <h2>Photo de profil</h2>
                <form onSubmit={handleImageUpload}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0] || null)}
                    style={{ width: '100%', marginTop: 5 }}
                  />
                  <button type="submit" disabled={busy} style={{ marginTop: 10, width: '100%' }}>
                    {busy ? 'Envoi…' : 'Uploader'}
                  </button>
                </form>
              </div>

              {/* Token Instagram (pour user/testeur) */}
              {(role === 'user' || role === 'testeur') && (
                <div style={{ marginTop: 24 }}>
                  <h2>Token Instagram</h2>
                  <form onSubmit={handleInstagramTokenChange}>
                    <input
                      type="text"
                      value={instagramToken}
                      onChange={(e) => setInstagramToken(e.target.value)}
                      placeholder="Entrez votre token Instagram"
                      style={{
                        width: '100%',
                        padding: '10px',
                        marginTop: '5px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--simple-color2)',
                        color: 'var(--simple-color)',
                      }}
                    />
                    <button type="submit" style={{ marginTop: 10, width: '100%' }}>
                      Mettre à jour le Token
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Gestion de l’abonnement */}
          {activeTab === 'subscription' && isSubscribed && (
            <div role="tabpanel" aria-labelledby="subscription">
              <h2>Gestion de l’abonnement</h2>
              <p style={{ marginBottom: 12 }}>
                Votre abonnement est <strong>actif</strong>. Vous pouvez gérer votre abonnement (résiliation à la fin de la période, changement de carte, etc.) depuis le portail sécurisé Stripe.
              </p>
              <button
                onClick={handleOpenCustomerPortal}
                disabled={portalLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'var(--main-color)',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: 8,
                  opacity: portalLoading ? 0.7 : 1,
                  cursor: portalLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {portalLoading ? 'Ouverture du portail…' : 'Gérer mon abonnement'}
              </button>
            </div>
          )}

          {/* Gestion du compte */}
          {activeTab === 'account' && (
            <div role="tabpanel" aria-labelledby="account">
              <h2>Gestion du compte</h2>

              {/* Nom d'utilisateur */}
              <form onSubmit={handleUsernameChange} style={{ marginBottom: 20 }}>
                <label>Nom d’utilisateur</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginTop: '5px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--simple-color2)',
                    color: 'var(--simple-color)',
                  }}
                />
                <button type="submit" style={{ marginTop: 10, width: '100%', backgroundColor: 'var(--main-color)' }}>
                  Modifier
                </button>
              </form>

              {/* Mot de passe */}
              <form onSubmit={handlePasswordChange} style={{ marginBottom: 20 }}>
                <label>Nouveau mot de passe</label>

                {/* Champ + œil */}
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder='Votre nouveau mot de passe'
                    aria-describedby="pwd-help pwd-meter"
                    style={{
                      width: '100%',
                      padding: '10px',
                      paddingRight: 70,
                      marginTop: '5px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--simple-color2)',
                      color: 'var(--simple-color)',
                    }}
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
                      fontSize: 13,
                      lineHeight: 1
                    }}
                  >
                    {showPwd ? '🙈' : '👁️'}
                  </button>
                </div>

                {/* Barre de progression */}
                <div id="pwd-meter" style={{ height: 8, background: 'rgba(0,0,0,0.15)', borderRadius: 999, overflow: 'hidden', marginTop: 8 }}>
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
                    marginTop: 6,
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

                <button
                  type="submit"
                  disabled={!isPwdValid}
                  style={{
                    marginTop: 10,
                    width: '100%',
                    padding: '10px',
                    backgroundColor: isPwdValid ? 'var(--main-color)' : '#9aa0a6',
                    color: 'var(--simple-color2)',
                    borderRadius: 8,
                    cursor: isPwdValid ? 'pointer' : 'not-allowed'
                  }}
                >
                  Changer le mot de passe
                </button>
              </form>

              {/* Suppression du compte */}
              <div style={{ marginTop: 20 }}>
                <button
                  onClick={() => setShowConfirm(true)}
                  style={{ width: '100%', backgroundColor: 'red', color: 'white' }}
                >
                  Supprimer mon compte
                </button>

                {showConfirm && (
                  <div
                    style={{
                      marginTop: 12,
                      backgroundColor: 'grey',
                      padding: '15px',
                      borderRadius: '8px',
                      textAlign: 'center',
                    }}
                  >
                    <p>
                      <strong>⚠️ Cette action est irréversible. Voulez-vous vraiment supprimer votre compte ?</strong>
                    </p>
                    <button onClick={handleDeleteAccount} style={{ margin: 5, backgroundColor: 'red', color: 'white' }}>
                      Oui, supprimer
                    </button>
                    <button onClick={() => setShowConfirm(false)} style={{ margin: 5 }}>
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
