import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadGoogleAnalytics } from '../utils/analytics'; // 👈 À ajouter

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    } else if (consent === 'true') {
      loadGoogleAnalytics(); // 👈 Charge GA si déjà accepté
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    loadGoogleAnalytics(); // 👈 Charge GA sans recharger la page
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'false');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div style={styles.banner}>
      <p style={styles.text}>
        Nous utilisons des cookies pour améliorer votre expérience et mesurer l'audience.{" "}
        <Link to="/cookiesPolicy" style={styles.link}>En savoir plus</Link>
      </p>
      <div style={styles.buttons}>
        <button onClick={handleDecline} style={styles.buttonDecline}>Refuser</button>
        <button onClick={handleAccept} style={styles.buttonAccept}>Accepter</button>
      </div>
    </div>
  );
};

const styles = {
  banner: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#2c2c2c',
    color: '#fff',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    zIndex: 9999,
    boxShadow: '0 -2px 10px rgba(0,0,0,0.2)',
  },
  text: {
    flex: 1,
    margin: 0,
    fontSize: '14px',
  },
  link: {
    color: '#4DB6AC',
    textDecoration: 'underline',
    marginLeft: '5px',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  buttonAccept: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  buttonDecline: {
    backgroundColor: '#d32f2f',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default CookieBanner;
