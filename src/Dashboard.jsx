// Dashboard.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function Dashboard() {
  const [followers, setFollowers] = useState(null);
  const [username, setUsername] = useState(null);
  const [popupType, setPopupType] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const lastFollowers = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchFollowers = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/followers', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newCount = res.data.followers_count;
      if (!username) setUsername(res.data.username);

      if (lastFollowers.current !== null && newCount !== lastFollowers.current) {
        setPopupType(newCount > lastFollowers.current ? 'increase' : 'decrease');
        setTimeout(() => setPopupType(null), 3000);
      }

      lastFollowers.current = newCount;
      setFollowers(newCount);
    } catch (err) {
      console.error('Erreur API :', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchFollowers();
    const interval = setInterval(fetchFollowers, 3000);
    return () => clearInterval(interval);
  }, []);

  const renderDigits = () => {
    if (followers === null) return null;
    return followers.toString().split('').map((digit, index) => (
      <div className="digit animate" key={`${digit}-${index}-${followers}`}>
        {digit}
      </div>
    ));
  };

  return (
    <div className="body-sim">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap:"20px", padding: '10px 20px', position:"fixed", top:"0", right:"0"  }}>
        <div><strong>Bienvenue{username ? `, ${username}` : ''}</strong></div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowMenu(!showMenu)} style={{ padding: '5px 10px' }}>☰</button>
          {showMenu && (
            <div style={{ position: 'absolute', top: '40px', right: 0, background: '#fff', border: '1px solid #ccc', padding: '10px', zIndex: 10 }}>
              <Link to="/profile">
                <button style={{ display: 'block', marginBottom: '10px' }}>Mon compte</button>
              </Link>
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

      <div className="contain">
        <div className="ins-logo">
          <img src="/insta-logo.png" alt="Instagram Logo" />
        </div>
        <div className="title-container">{renderDigits()}</div>
      </div>
    </div>
  );
}

export default Dashboard;
