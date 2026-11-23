import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StatusScreen } from '../components/PageLayout';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/dashboard'), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <StatusScreen
      icon="🎉"
      tone="success"
      title="Bienvenue en Premium !"
      actions={<Link to="/dashboard" className="btn btn--primary btn--lg">Voir mon compteur</Link>}
    >
      <p>Votre paiement a bien été reçu. Redirection vers votre compteur…</p>
    </StatusScreen>
  );
};

export default PaymentSuccess;
