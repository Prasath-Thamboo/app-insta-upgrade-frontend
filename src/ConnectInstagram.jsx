import React from 'react';
import { useNavigate, Link } from 'react-router-dom';


const ConnectInstagram = () => {
  const handleConnect = () => {
    // Redirection vers l'URL OAuth (sera à remplacer par la vraie URL plus tard)
    window.location.href = 'https://www.facebook.com/v19.0/dialog/oauth?' +
      new URLSearchParams({
        client_id: import.meta.env.VITE_INSTAGRAM_CLIENT_ID,
        redirect_uri: import.meta.env.VITE_INSTAGRAM_REDIRECT_URI,
        scope: 'user_profile,user_media',
        response_type: 'code',
      }).toString();
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'var(--bg)',
      flexDirection: 'column',
      padding: '20px', 
      gap:'20px'
    }}>
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <Link to="/dashboard">
            <button style={{ backgroundColor: 'var(--main-color)', color: 'white', padding: '10px 20px' }}>
                ← Retour au dashboard
            </button>
            </Link>
        </div>
        <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '40px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            maxWidth: '400px',
            width: '100%'
        }}>
            <img
            src="/insta-logo.png"
            alt="Instagram"
            style={{ width: '80px', marginBottom: '20px' }}
            />
            <h2 style={{color:'var(--simple-color)'}}>Connexion Instagram</h2>
            <p style={{ marginBottom: '30px', color: '#555' }}>
            Connectez votre compte Instagram pour permettre l'accès à vos statistiques, y compris le nombre de followers.
            </p>
            <button onClick={handleConnect} style={{
            padding: '12px 24px',
            backgroundColor: 'var(--main-color)',
            color: 'white',
            fontSize: '16px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background 0.3s'
            }}>
            Se connecter à Instagram
            </button>
        </div>
    </div>
  );
};

export default ConnectInstagram;
