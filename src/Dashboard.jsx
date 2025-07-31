import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function Dashboard() {
  const [followers, setFollowers] = useState(null);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);
  const [profilePicture, setProfilePicture] = useState('');
  const [popupType, setPopupType] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [design, setDesign] = useState('classic');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [instagramToken, setInstagramToken] = useState(null);
  const lastFollowers = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchUserInfo = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsername(res.data.username);
      setRole(res.data.role);
      setProfilePicture(res.data.profilePicture);
      setDesign(res.data.dashboardStyle);
      setIsSubscribed(res.data.isSubscribed);
      setInstagramToken(res.data.instagramToken);
    } catch (err) {
      console.error('Erreur lors de la récupération des infos utilisateur :', err);
    }
  };

  const fetchFollowers = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/followers', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newCount = res.data.followers_count;

      if (lastFollowers.current !== null && newCount !== lastFollowers.current) {
        setPopupType(newCount > lastFollowers.current ? 'increase' : 'decrease');
        setTimeout(() => setPopupType(null), 3000);
      }

      lastFollowers.current = newCount;
      setFollowers(newCount);
    } catch (err) {
      console.warn('Impossible de récupérer les followers :', err?.response?.data?.message || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchUserInfo();
    fetchFollowers();
    const interval = setInterval(fetchFollowers, 3000);
    return () => clearInterval(interval);
  }, []);

  const renderDigits = () => {
    if (followers === null) return null;
    return followers.toString().split('').map((digit, index) => (
      <div className={`digit animate ${design}`} key={`${digit}-${index}-${followers}`}>
        {digit}
      </div>
    ));
  };

  return (
    <div className={`body-sim ${design}`}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: "20px",
        padding: '10px 20px',
        position: "fixed",
        top: "0",
        right: "0",
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <strong>
            Bienvenue{username ? `, ${username}` : ''}{role === 'admin' ? ' (admin)' : ''}
          </strong>
        </div>

        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowMenu(!showMenu)} style={{ padding: '5px 10px' }}>☰</button>
          {showMenu && (
            <div style={{
              position: 'absolute',
              top: '40px',
              right: 0,
              background: '#fff',
              border: '1px solid #ccc',
              padding: '10px',
              zIndex: 10
            }}>
              {(role === 'user' || role === 'admin') && (
                <Link to="/profile">
                  <button style={{ display: 'block', marginBottom: '10px' }}>Mon compte</button>
                </Link>
              )}

              {role === 'admin' && (
                <Link to="/admin">
                  <button style={{ display: 'block', marginBottom: '10px' }}>Panneau Admin</button>
                </Link>
              )}

              {(role === 'user' || role === 'freeuser') && (
                <Link to="/contact">
                  <button style={{ display: 'block', marginBottom: '10px' }}>Contact</button>
                </Link>
              )}

              <button onClick={handleLogout} style={{ background: 'tomato', color: 'white' }}>Déconnexion</button>
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
            src={profilePicture || '/insta-logo.png'}
            alt="Profil utilisateur ou logo Instagram"
            style={{ objectFit: 'cover', width: '300px', marginRight: '20px' }}
          />
        </div>
        <div className="title-container">{renderDigits()}</div>

        {role === 'user' && !instagramToken && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/connect-instagram">
              <button style={{
                padding: '12px 24px',
                background: 'var(--bg)',
                color: 'white',
                fontSize: '16px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Connecter mon compte Instagram
              </button>
            </Link>
          </div>
        )}

        {role === 'freeuser' && !isSubscribed && (
          <div style={{ marginTop: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Link to="/subscribe">
              <button style={{
                padding: '12px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                fontSize: '16px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                S'abonner
              </button>
            </Link>
            <Link to="/register">
              <button style={{
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                fontSize: '16px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Tester pendant 7 jours
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
