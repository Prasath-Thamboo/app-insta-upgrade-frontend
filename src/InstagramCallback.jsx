import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InstagramCallback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Connexion à Instagram en cours...');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const token = localStorage.getItem('token');

    if (!code) {
      setMessage("Code de connexion manquant dans l'URL.");
      return;
    }

    let called = false;

    const exchangeCode = async () => {
      if (called) return;
      called = true;

      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/instagram/exchange-code`, { code }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        setMessage('Connexion Instagram réussie. Redirection...');
        setTimeout(() => {
          window.history.replaceState({}, document.title, "/dashboard"); // Nettoie l’URL
          navigate('/dashboard');
        }, 2000);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setMessage("Erreur lors de la connexion à Instagram.");
      }
    };

    exchangeCode();
  }, [navigate]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f0f2f5',
      fontSize: '18px',
      fontWeight: '500',
      color: '#333',
      padding: '20px',
      textAlign: 'center',
    }}>
      {message}
    </div>
  );
};

export default InstagramCallback;
