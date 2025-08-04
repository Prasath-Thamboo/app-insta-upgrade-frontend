import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StartTrial = () => {
  const [message, setMessage] = useState('Activation de l’essai en cours...');
  const navigate = useNavigate();

  useEffect(() => {
    const activateTrial = async () => {
      const token = localStorage.getItem('token');

      try {
        await axios.post('http://localhost:3001/api/start-trial', {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        setMessage('Essai gratuit activé avec succès ! Redirection...');
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (err) {
        console.error(err);
        setMessage("Erreur lors de l’activation de l’essai gratuit. Si vous avez déjà tester notre application, cette erreur est normale ");
        setTimeout(() => navigate('/dashboard'), 4000);
      }
    };

    activateTrial();
  }, [navigate]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'var(--bg)',
      fontSize: '18px',
      fontWeight: '700',
    }}>
      {message}
    </div>
  );
};

export default StartTrial;
