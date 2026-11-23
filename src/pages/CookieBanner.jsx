import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadGoogleAnalytics } from '../utils/analytics';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    } else if (consent === 'true') {
      loadGoogleAnalytics();
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    loadGoogleAnalytics();
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'false');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Consentement aux cookies">
      <p className="cookie-banner__text">
        🍪 Nous utilisons des cookies pour améliorer votre expérience et mesurer l'audience.{' '}
        <Link to="/cookiesPolicy">En savoir plus</Link>
      </p>
      <div className="cookie-banner__actions">
        <button type="button" className="btn btn--sm" onClick={handleDecline}>Refuser</button>
        <button type="button" className="btn btn--primary btn--sm" onClick={handleAccept}>Accepter</button>
      </div>
    </div>
  );
};

export default CookieBanner;
