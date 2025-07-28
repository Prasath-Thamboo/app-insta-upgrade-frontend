import React from 'react';
import axios from 'axios';

const StripeCheckout = () => {
  const handleSubscribe = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Veuillez vous connecter.");
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:3001/api/stripe/create-checkout-session',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de la session Stripe");
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h2>Abonnement mensuel</h2>
      <p>Accédez au compteur et à toutes les fonctionnalités avec un abonnement actif.</p>
      <button onClick={handleSubscribe} style={{
        padding: "12px 24px",
        backgroundColor: "#6772e5",
        color: "white",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
      }}>
        S’abonner maintenant
      </button>
    </div>
  );
};

export default StripeCheckout;
