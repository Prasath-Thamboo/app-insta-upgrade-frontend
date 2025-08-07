import React, { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/forgot-password`, { email });
      setSubmitted(true);
      setMessage("📩 Si l'adresse est correcte, un email a été envoyé.");
    } catch (err) {
      setMessage("❌ Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Mot de passe oublié</h2>
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>
              Adresse e-mail :
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                style={styles.input}
              />
            </label>
            <button type="submit" style={styles.button}>
              Envoyer le lien de réinitialisation
            </button>
          </form>
        ) : (
          <p style={styles.info}>{message}</p>
        )}

        {message && !submitted && <p style={styles.info}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f4f6f8',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    marginBottom: '25px',
    textAlign: 'center',
    color: '#333',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginTop: '6px',
    marginBottom: '20px',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'var(--main-color)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  info: {
    marginTop: '20px',
    color: '#555',
    textAlign: 'center',
  },
};
