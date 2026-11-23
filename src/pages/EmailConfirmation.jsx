import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { StatusScreen } from '../components/PageLayout';

const EmailConfirmation = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('Validation en cours…');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/verify-email/${token}`);
        setMessage(res.data.message || 'Email vérifié avec succès.');
        setSuccess(true);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Erreur lors de la validation.');
        setSuccess(false);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setMessage('Lien de validation invalide.');
      setSuccess(false);
    }
  }, [token]);

  if (success === null) {
    return <StatusScreen icon={<span className="spinner" />} title={message} />;
  }

  return (
    <StatusScreen
      icon={success ? '✓' : '!'}
      tone={success ? 'success' : 'error'}
      title={message}
      actions={
        success
          ? <Link to="/login" className="btn btn--primary btn--lg">Se connecter</Link>
          : <Link to="/contact" className="btn btn--lg">Contacter le support</Link>
      }
    >
      <p>{success ? 'Votre compte est activé. Vous pouvez maintenant vous connecter.' : 'Le lien est peut-être expiré ou a déjà été utilisé.'}</p>
    </StatusScreen>
  );
};

export default EmailConfirmation;
