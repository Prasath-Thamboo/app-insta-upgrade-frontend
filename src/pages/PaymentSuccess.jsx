import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000); // 3 secondes

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="body-sim">
      <h2>Paiement réussi ✅</h2>
      <p>Redirection vers votre dashboard...</p>
    </div>
  );
};

export default PaymentSuccess;
