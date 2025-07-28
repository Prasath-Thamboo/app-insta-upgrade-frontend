// src/EmailConfirmation.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EmailConfirmation = () => {
  const { token } = useParams(); // ✅ Utilise useParams pour récupérer le token de l’URL
  const [message, setMessage] = useState('Validation en cours...');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/verify-email/${token}`);
        setMessage(res.data.message || "Email vérifié avec succès.");
        setSuccess(true);
      } catch (err) {
        setMessage(err.response?.data?.message || "Erreur lors de la validation.");
        setSuccess(false);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setMessage("Lien de validation invalide.");
      setSuccess(false);
    }
  }, [token]);

  return (
    <div style={{
      padding: "60px",
      textAlign: "center",
      backgroundColor: success ? "#d4edda" : "#f8d7da",
      color: success ? "#155724" : "#721c24",
      borderRadius: "10px",
      margin: "50px auto",
      maxWidth: "500px"
    }}>
      <h2>{message}</h2>
      {success && <p>Vous pouvez maintenant vous connecter.</p>}
    </div>
  );
};

export default EmailConfirmation;
