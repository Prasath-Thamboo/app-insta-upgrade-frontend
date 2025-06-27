import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [followers, setFollowers] = useState(null);
  const [username, setUsername] = useState(null);
  const [popupType, setPopupType] = useState(null); // 'increase' | 'decrease'
  const lastFollowers = useRef(null);

  const fetchFollowers = async () => {
    try {
      const res = await axios.get('https://ig-counter-backend.onrender.com');

      const newCount = res.data.followers_count;

      // Mise à jour du nom d’utilisateur si nécessaire
      if (!username) setUsername(res.data.username);

      // Détection de changement
      if (lastFollowers.current !== null && newCount !== lastFollowers.current) {
        if (newCount > lastFollowers.current) {
          setPopupType('increase');
        } else {
          setPopupType('decrease');
        }

        // Disparition automatique de la popup
        setTimeout(() => setPopupType(null), 3000);
      }

      // Stocker la nouvelle valeur et l'afficher
      lastFollowers.current = newCount;
      setFollowers(newCount);
    } catch (err) {
      console.error('Erreur API :', err);
    }
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

export default App;
