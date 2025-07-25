// src/pages/EmailConfirmation.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmailConfirmation = () => {
  const [message, setMessage] = useState('Validation en cours...');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const verifyEmail = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/verify-email?token=${token}`);
        setMessage(res.data.message);
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
  }, []);

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
