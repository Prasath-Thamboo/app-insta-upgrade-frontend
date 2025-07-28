import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancelled = () => {
  return (
    <div style={{
      padding: '60px',
      textAlign: 'center',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderRadius: '10px',
      margin: '50px auto',
      maxWidth: '500px'
    }}>
      <h2>Paiement annulé</h2>
      <p>Vous avez annulé le paiement. Aucun montant n'a été débité.</p>
      <Link to="/dashboard">Retour au tableau de bord</Link>
    </div>
  );
};

export default PaymentCancelled;
