import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Brand } from '../components/SiteHeader';

const IDLE_DELAY = 3000;

function Dashboard() {
  const [followers, setFollowers] = useState(null);
  const [igUsername, setIgUsername] = useState(null);   // username Instagram (affiché sous le compteur)
  const [appUsername, setAppUsername] = useState(null); // username de l'app (pour la barre)
  const [role, setRole] = useState(null);
  const [profilePicture, setProfilePicture] = useState('');
  const [popupType, setPopupType] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [design, setDesign] = useState('classic');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [instagramToken, setInstagramToken] = useState(null);
  const [trialStart, setTrialStart] = useState(null);
  const [barVisible, setBarVisible] = useState(true);

  const lastFollowers = useRef(null);
  const idleTimer = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchUserInfo = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppUsername(res.data.username);
      setRole(res.data.role);
      setProfilePicture(res.data.profilePicture);
      setDesign(res.data.dashboardStyle || 'classic');
      setIsSubscribed(res.data.isSubscribed);
      setInstagramToken(res.data.instagramToken);
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
      // Format backend : { igUsername, followersCount }
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  useEffect(() => {
    fetchUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!instagramToken) return;
    fetchFollowers();
    const interval = setInterval(fetchFollowers, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instagramToken]);

  // La barre se masque après quelques secondes d'inactivité (mode affichage)
  useEffect(() => {
    const wake = () => {
      setBarVisible(true);
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setBarVisible(false), IDLE_DELAY);
    };
    wake();
    const events = ['mousemove', 'touchstart', 'keydown'];
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    return () => {
      clearTimeout(idleTimer.current);
      events.forEach((e) => window.removeEventListener(e, wake));
    };
  }, []);

  // Fermer le menu au clic extérieur
  useEffect(() => {
    if (!showMenu) return;
    const close = () => setShowMenu(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [showMenu]);

  const trialEndDate = trialStart
    ? new Date(new Date(trialStart).getTime() + 7 * 24 * 60 * 60 * 1000)
    : null;

  const needsPlan = role === 'freeuser' && !isSubscribed;
  const needsInstagram = (role === 'user' || role === 'testeur') && !instagramToken;

  return (
    <div className={`body-sim dash ${design}`}>
      {/* Barre flottante */}
      <header className={`dash-bar ${barVisible || showMenu ? '' : 'is-hidden'}`}>
        <Brand to="/" />
        <div className="dash-bar__actions">
          <div className="dash-bar__user">
            <span className="hide-sm">
              {appUsername ? `Bonjour, ${appUsername}` : ''}
            </span>
            {role === 'admin' && <span className="badge badge--brand">Admin</span>}
            {isSubscribed && <span className="badge badge--success hide-sm">Premium</span>}
          </div>
          <button type="button" className="icon-btn" onClick={toggleFullscreen} title="Plein écran" aria-label="Plein écran">⛶</button>
          <div className="dash-menu" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="icon-btn"
              onClick={() => setShowMenu((v) => !v)}
              aria-label="Menu"
              aria-expanded={showMenu}
            >☰</button>
            {showMenu && (
              <div className="dash-menu__panel" role="menu">
                <Link to="/profile" role="menuitem">👤 Mon compte</Link>
                <Link to="/profile" role="menuitem">🎨 Changer de design</Link>
                {role === 'admin' && <Link to="/admin" role="menuitem">🛠️ Panneau admin</Link>}
                {role !== 'admin' && <Link to="/contact" role="menuitem">💬 Contact</Link>}
                <hr />
                <button type="button" onClick={handleLogout} className="danger" role="menuitem">↪ Déconnexion</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notification de variation */}
      {popupType && (
        <div className={`toast ${popupType === 'increase' ? 'toast--up' : 'toast--down'}`} role="status">
          {popupType === 'increase' ? '🚀 Nouvel abonné !' : '📉 Un abonné en moins'}
        </div>
      )}

      {/* Bannières d'action */}
      {needsPlan && (
        <div className="dash-notice">
          <p>🎁 Activez votre essai gratuit de 7 jours ou passez Premium pour afficher votre compteur.</p>
          <div className="row">
            <Link to="/start-trial" className="btn btn--sm">Essai 7 jours</Link>
            <Link to="/subscribe" className="btn btn--grad btn--sm">S’abonner</Link>
          </div>
        </div>
      )}

      {role === 'testeur' && trialEndDate && (
        <div className="dash-notice">
          <p>⏳ Essai gratuit actif jusqu’au <strong>{trialEndDate.toLocaleDateString('fr-FR')}</strong></p>
          <Link to="/subscribe" className="btn btn--grad btn--sm">Passer Premium</Link>
        </div>
      )}

      {/* Compteur */}
      <div className={`contain ${design}`}>
        <div className="ins-logo">
          <img src={profilePicture || '/insta-logo2.png'} alt="Photo de profil" />
        </div>

        {followers !== null ? (
          <div>
            <p className="dash-label">Abonnés</p>
            <div className="title-container" aria-live="polite" aria-label={`${followers} abonnés`}>
              {followers.toString().split('').map((digit, index) => (
                <div className={`digit animate ${design}`} key={`${digit}-${index}-${followers}`}>
                  {digit}
                </div>
              ))}
            </div>
          </div>
        ) : needsInstagram ? (
          <div className="dash-empty">
            <h2>Connectez votre compte Instagram</h2>
            <p>Dernière étape avant de voir vos abonnés s’afficher en direct.</p>
            <div className="row" style={{ justifyContent: 'center' }}>
              <Link to="/connect-instagram" className="btn btn--primary">Connecter Instagram</Link>
              <Link to="/get-instagram-token" className="btn">Voir le guide</Link>
            </div>
          </div>
        ) : instagramToken ? (
          <div className="dash-empty">
            <div className="spinner" style={{ margin: '0 auto 12px' }} />
            <p>Récupération de vos abonnés…</p>
          </div>
        ) : null}
      </div>

      {igUsername && (
        <div className="ig-handle">
          Abonnez-vous <strong>@{igUsername}</strong>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
