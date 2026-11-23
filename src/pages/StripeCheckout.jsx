import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';

const StripeCheckout = () => {
  const token = localStorage.getItem('token');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!token) {
      setError('Veuillez vous connecter pour vous abonner.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/stripe/create-checkout-session`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la création de la session de paiement.');
      setLoading(false);
    }
  };

  return (
    <PageLayout back={{ to: '/dashboard', label: 'Retour au compteur' }}>
      <div className="page__head center">
        <span className="eyebrow">Tarifs</span>
        <h1 style={{ marginTop: 14 }}>Choisissez votre offre</h1>
        <p>Paiement sécurisé par Stripe. Sans engagement, résiliable à tout moment.</p>
      </div>

      {error && (
        <div className="alert alert--error" role="alert" style={{ maxWidth: 820, margin: '0 auto 20px' }}>
          {error} {!token && <Link to="/login">Se connecter</Link>}
        </div>
      )}

      <div className="pricing">
        <article className="plan">
          <h3>Essai gratuit</h3>
          <p>Pour découvrir le service.</p>
          <div className="plan__price">0 € <small>/ 7 jours</small></div>
          <ul>
            <li>Accès temporaire au compteur</li>
            <li>Les 5 designs</li>
            <li>Assistance standard</li>
          </ul>
          <Link to="/start-trial" className="btn btn--block btn--lg">Activer l’essai</Link>
        </article>

        <article className="plan plan--featured">
          <span className="plan__tag">Recommandé</span>
          <h3>Premium</h3>
          <p>Pour un affichage permanent.</p>
          <div className="plan__price">19,99 € <small>/ mois</small></div>
          <ul>
            <li>Accès complet au compteur</li>
            <li>Alertes de variations</li>
            <li>Suivi automatique</li>
            <li>Assistance prioritaire</li>
          </ul>
          <button type="button" onClick={handleSubscribe} className="btn btn--grad btn--block btn--lg" disabled={loading}>
            {loading ? 'Redirection…' : 'Passer à Premium'}
          </button>
        </article>
      </div>
      <p className="center muted" style={{ marginTop: 24, fontSize: '.9rem' }}>🔒 Paiement 100 % sécurisé via Stripe</p>
    </PageLayout>
  );
};

export default StripeCheckout;
