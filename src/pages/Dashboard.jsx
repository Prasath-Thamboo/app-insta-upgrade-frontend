import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../css/App.css';

function Dashboard() {
  const [followers, setFollowers] = useState(null);
  const [igUsername, setIgUsername] = useState(null);   // 👈 username Instagram (affiché sous le compteur)
  const [appUsername, setAppUsername] = useState(null); // 👈 username de TON app (pour le header)
  const [role, setRole] = useState(null);
  const [profilePicture, setProfilePicture] = useState('');
  const [popupType, setPopupType] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [design, setDesign] = useState('classic');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [instagramToken, setInstagramToken] = useState(null);
  const [trialStart, setTrialStart] = useState(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  const lastFollowers = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const hideHeaderIfAllowed = () => {
    if (!showMenu) setHeaderVisible(false);
  };

  const fetchUserInfo = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppUsername(res.data.username);            // username de ton app
      setRole(res.data.role);
      setProfilePicture(res.data.profilePicture);
      setDesign(res.data.dashboardStyle);
      setIsSubscribed(res.data.isSubscribed);
      setInstagramToken(res.data.instagramToken);  // sert juste à savoir si on peut poll
      setTrialStart(res.data.trialStart);
    } catch (err) {
      console.error('Erreur /api/me :', err);
    }
  };

  const fetchFollowers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/followers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Nouveau format normalisé du backend :
      // { igUsername, followersCount }
      const count = res.data?.followersCount ?? null;
      const name = res.data?.igUsername ?? null;

      if (count !== null) {
        if (lastFollowers.current !== null && count !== lastFollowers.current) {
          setPopupType(count > lastFollowers.current ? 'increase' : 'decrease');
          setTimeout(() => setPopupType(null), 3000);
        }
        lastFollowers.current = count;
        setFollowers(count);
      }

      if (name) setIgUsername(name);
    } catch (err) {
      console.warn('Impossible de récupérer les followers :', err?.response?.data?.message || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Charger les infos utilisateur
  useEffect(() => {
    fetchUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll followers si on a un instagramToken
  useEffect(() => {
    if (!instagramToken) return;
    fetchFollowers();
    const interval = setInterval(fetchFollowers, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instagramToken]);

  const renderDigits = () => {
    if (followers === null) return null;
    return followers.toString().split('').map((digit, index) => (
      <div className={`digit animate ${design}`} key={`${digit}-${index}-${followers}`}>
        {digit}
      </div>
    ));
  };

  const trialEndDate = trialStart
    ? new Date(new Date(trialStart).getTime() + 7 * 24 * 60 * 60 * 1000)
    : null;

  return (
    <div className={`body-sim ${design}`}>

      {/* Hotspot en haut à droite */}
      <div className="header-hotspot" onMouseEnter={() => setHeaderVisible(true)} aria-hidden="true" />

      {/* Overlay sombre quand le menu est ouvert */}
      {showMenu && (
        <div
          className="page-overlay"
          onClick={() => {
            setShowMenu(false);
            hideHeaderIfAllowed();
          }}
        />
      )}

      {/* Zone sombre en haut à droite */}
      <div className="header-trigger" onMouseEnter={() => setHeaderVisible(true)} />

      {/* Header qui apparaît au survol */}
      <header
        className={`peek-header ${headerVisible ? 'visible' : ''}`}
        onMouseLeave={() => setHeaderVisible(false)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--simple-color2)' }}>
          <strong>
            Bienvenue{appUsername ? `, ${appUsername}` : ''}{role === 'admin' ? ' (admin)' : ''}
          </strong>
        </div>

        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowMenu(v => !v)} className="icon-btn" aria-label="Menu">☰</button>
          {showMenu && (
            <div className="dropdown-panel">
              <Link to="/profile"><button className="menu-btn">Mon compte</button></Link>
              {role === 'admin' && (
                <Link to="/admin"><button className="menu-btn">Panneau Admin</button></Link>
              )}
              {(role === 'user' || role === 'freeuser' || role === 'testeur') && (
                <Link to="/contact"><button className="menu-btn">Contact</button></Link>
              )}
              <button onClick={handleLogout} className="menu-btn danger">Déconnexion</button>
            </div>
          )}
        </div>
      </header>

      {popupType && (
        <div className={`popup ${popupType}`}>
          {popupType === 'increase' ? 'Gain de followers 🚀' : 'Perte de followers 😢'}
        </div>
      )}

      <div className={`contain ${design}`}>
        <div className="ins-logo">
          <img
            src={profilePicture || '/insta-logo2.png'}
            alt="Profil utilisateur ou logo Instagram"
          />
        </div>

        <div className="title-container">{renderDigits()}</div>

        {(role === 'freeuser' && !isSubscribed) && (
          <div className="cta-row">
            <Link to="/subscribe">
              <button className="btn" style={{ backgroundColor: 'var(--main-color)', color: 'var(--simple-color2)' }}>
                S’abonner
              </button>
            </Link>
            <Link to="/start-trial">
              <button className="btn" style={{ backgroundColor: 'orange', color: 'var(--simple-color2)' }}>
                Tester pendant 7 jours
              </button>
            </Link>
          </div>
        )}

        {(role === 'testeur') && trialEndDate && (
          <div style={{ marginTop: '30px', textAlign: 'center', color: 'orange', fontWeight: 'bold' }}>
            ⏳ Essai gratuit en cours jusqu’au : {trialEndDate.toLocaleDateString('fr-FR')}
          </div>
        )}

        {(role === 'user' || role === 'testeur') && !instagramToken && (
          <div className="cta-row">
            <Link to="/get-instagram-token">
              <button className="btn" style={{ backgroundColor: 'var(--main-color)', color: 'white' }}>
                Obtenir mon token Instagram
              </button>
            </Link>
            {/*<Link to="/connect-instagram">
              <button className="btn" style={{ background: 'var(--bg)', color: 'white' }}>
                Connecter votre compte Instagram
              </button>
            </Link>*/}
          </div>
        )}
      </div>

      {/* Légende : nom de la page Instagram (jamais le username de l'app) */}
        {igUsername && (
          <div style={{
            marginTop: '30px',
            textAlign: 'center',
            opacity: 0.95,
            background: 'var(--bg)',
            color: '#fff',
            padding: '20px',
            borderRadius: '12px'
            }}>
            <span style={{ fontWeight: 400, letterSpacing: '0.3px', fontSize:'30px' }}>
              Abonnez-vous <strong style={{ color:'var(--bg)' }}>@{igUsername}</strong>
            </span>
          </div>

        )}

    </div>
  );
}

export default Dashboard;
