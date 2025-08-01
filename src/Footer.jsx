import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {!visible && (
        <div style={{ textAlign: 'center', padding: '10px', background: 'transparent' }}>
          <button
            onClick={() => setVisible(true)}
            style={{
              padding: '8px 16px',
              background: 'var(--bg)',
              fontWeight:'bold',
              color: 'var(simple-color2)',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
          >
            Mentions légales & Cookies
          </button>
        </div>
      )}

      <div
        style={{
          position: 'fixed',
          bottom: visible ? '0' : '-200px',
          left: 0,
          right: 0,
          background: 'transparent',
          color: 'white',
          padding: '20px',
          textAlign: 'center',
          transition: 'bottom 0.4s ease-in-out',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)',
          zIndex: 9999,
        }}
      >
        <button
          onClick={() => setVisible(false)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Fermer ✕
        </button>

        <p>© {new Date().getFullYear()} MonApplication. Tous droits réservés.</p>
         <p style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/politique-confidentialite">Politique de confidentialité</Link>
          <Link to="/conditions-utilisation">Conditions d’utilisation</Link>
          <Link to="/cookiesPolicy">Cookies</Link>
        </p>
      </div>
    </>
  );
};

export default Footer;
