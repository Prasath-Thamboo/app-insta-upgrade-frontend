import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StatusScreen } from '../components/PageLayout';

const StartTrial = () => {
  const [status, setStatus] = useState('loading'); // loading | success | error
  const navigate = useNavigate();

  useEffect(() => {
    const activateTrial = async () => {
      const token = localStorage.getItem('token');
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/start-trial`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStatus('success');
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (err) {
        console.error(err);
        setStatus('error');
        setTimeout(() => navigate('/dashboard'), 4000);
      }
    };
    activateTrial();
  }, [navigate]);

  const content = {
    loading: { icon: <span className="spinner" />, tone: 'brand', title: 'Activation de l’essai…', text: 'Un instant, nous préparons votre accès.' },
    success: { icon: '🎁', tone: 'success', title: 'Essai gratuit activé !', text: 'Profitez de 7 jours d’accès complet. Redirection…' },
    error: { icon: '!', tone: 'error', title: 'Activation impossible', text: 'L’essai gratuit n’est disponible qu’une seule fois par compte. Redirection vers votre tableau de bord…' },
  }[status];

  return (
    <StatusScreen icon={content.icon} tone={content.tone} title={content.title}>
      <p>{content.text}</p>
    </StatusScreen>
  );
};

export default StartTrial;
