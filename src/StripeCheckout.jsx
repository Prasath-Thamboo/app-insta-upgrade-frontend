import React from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


const StripeCheckout = () => {
  const token = localStorage.getItem('token');

  const handleSubscribe = async () => {
    if (!token) {
      alert("Veuillez vous connecter.");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/stripe/create-checkout-session`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de la session Stripe");
    }
  };

  return (
    <div style={{ padding: "60px", fontFamily: 'Arial', background: 'var(--bg)', height:"87vh"}}>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <Link to="/dashboard">
          <button style={{ backgroundColor: '#007BFF', color: 'white', padding: '10px 20px' }}>
            ← Retour au dashboard
          </button>
        </Link>
      </div>

      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>Choisissez votre offre</h1>
      
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "40px",
        flexWrap: "wrap"
      }}>
        {/* Free Plan */}
        <div style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: "12px",
          padding: "30px",
          width: "300px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)", 
          color:'black'
        }}>
          <h2>Gratuit</h2>
          <p><strong>Durée :</strong> 7 jours</p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>⏳ Accès temporaire au compteur</li>
            <li>🔒 Limité à certaines fonctions</li>
            <li>📧 Assistance standard</li>
          </ul>
          <p style={{ marginTop: "20px", fontWeight: "bold", color: "tomato" }}>Expire après 7 jours</p>
        </div>

        {/* Premium Plan */}
        <div style={{
          backgroundColor: "#fff",
          border: "2px solid var(--main-color)",
          borderRadius: "12px",
          padding: "30px",
          width: "300px",
          boxShadow: "0 0 15px rgba(0,0,0,0.15)",
          position: "relative"
        }}>
          <div style={{
            position: "absolute",
            top: "-15px",
            right: "-15px",
            backgroundColor: "var(--main-color)",
            color: "white",
            padding: "5px 15px",
            borderRadius: "20px",
            fontSize: "14px",
          }}>
            Recommandé ⭐
          </div>
          <h2 style={{ color:"black" }}>Premium</h2>
          <p style={{ color:"black" }}><strong>19.99€/mois</strong></p>
          <ul style={{ listStyle: "none", padding: 0, color:"black" }}>
            <li>✅ Accès complet au compteur</li>
            <li>🔔 Alertes de variations</li>
            <li>📈 Suivi automatique</li>
            <li>💬 Assistance prioritaire</li>
          </ul>
          <button onClick={handleSubscribe} style={{
            marginTop: "20px",
            padding: "12px 24px",
            backgroundColor: "var(--main-color)",
            color: "white",
            fontSize: "16px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%"
          }}>
            Passer à Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;
