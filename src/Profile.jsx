import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

export default function Profile() {
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [style, setStyle] = useState('classic');
  const [instagramToken, setInstagramToken] = useState('');
  const [role, setRole] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('preferences'); // 'preferences' | 'subscription' | 'account'

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("User data from /api/me:", res.data); // 👈 ICI

        setUsername(res.data.username);
        setNewUsername(res.data.username);
        setProfilePicture(res.data.profilePicture);
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
      setMessage("Nom d'utilisateur mis à jour.");
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la mise à jour du nom d'utilisateur");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/update-password`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPassword('');
      setMessage('Mot de passe mis à jour.');
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la mise à jour du mot de passe");
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
      setMessage("Erreur lors de la suppression du compte");
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Veuillez sélectionner une image.');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload-profile-picture`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfilePicture(res.data.url);
      setMessage('Photo de profil mise à jour.');
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de l'upload de l'image.");
    }
  };

  const updateStyle = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/update-style`,
        { dashboardStyle: style },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Style mis à jour.');
    } catch (err) {
      setMessage('Erreur lors de la mise à jour du style');
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
      setMessage('Token Instagram mis à jour.');
    } catch (err) {
      console.error(err);
      setMessage('Erreur lors de la mise à jour du token Instagram, si vous voulez le supprimer le token mettez un espace et appuyer sur le bouton');
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
      setMessage("Impossible d'ouvrir le portail d'abonnement.");
    } finally {
      setPortalLoading(false);
    }
  };

  // --- UI helpers ---

  const TabButton = ({ id, label, hidden }) => {
    if (hidden) return null;
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
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
    <div className="body-sim" style={{ minHeight: '100%' }}>
      <div
        style={{
          maxWidth: '900px',
          width: '100%',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
          margin: '0 auto',
          height: '700px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

        {/* Avatar */}
        {profilePicture && (
          <div style={{ marginTop: 16 }}>
            <img
              src={profilePicture}
              alt="Profil"
              style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
        )}

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
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ width: '100%', marginTop: 5 }}
                  />
                  <button type="submit" style={{ marginTop: 10, width: '100%' }}>
                    Uploader
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
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder='Votre nouveau mot de passe'
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

        {message && <p style={{ marginTop: 20, color: 'green', textAlign: 'center' }}>{message}</p>}
      </div>
    </div>
  );
}
