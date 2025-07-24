import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

export default function Profile() {
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tokenSet, setTokenSet] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await axios.get('http://localhost:3001/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(res.data.username);
        setNewUsername(res.data.username);
        setTokenSet(!!res.data.instagramToken);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUserData();
  }, [token]);

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://localhost:3001/api/update-username',
        { username: newUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsername(newUsername);
      setMessage('Nom d’utilisateur mis à jour.');
    } catch (err) {
      setMessage("Erreur lors de la mise à jour du nom d'utilisateur");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://localhost:3001/api/update-password',
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPassword('');
      setMessage('Mot de passe mis à jour.');
    } catch (err) {
      setMessage('Erreur lors de la mise à jour du mot de passe');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete('http://localhost:3001/api/delete-account', {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      setMessage("Erreur lors de la suppression du compte");
    }
  };

  return (
    <div className="body-sim">
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1>Mon compte</h1>
          <p>Bienvenue, <strong style={{ color: '#007BFF' }}>{username}</strong></p>
        </div>

        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <Link to="/dashboard">
            <button style={btnPrimary}>← Retour au dashboard</button>
          </Link>
        </div>

        <form onSubmit={handleUsernameChange} style={sectionStyle}>
          <label style={labelStyle}>Modifier le nom d’utilisateur :</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={btnPrimary}>Enregistrer</button>
        </form>

        <form onSubmit={handlePasswordChange} style={sectionStyle}>
          <label style={labelStyle}>Modifier le mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={btnPrimary}>Enregistrer</button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p>Statut Instagram Token : <strong>{tokenSet ? '✅ Actif' : '❌ Inactif'}</strong></p>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button
            onClick={() => setShowConfirm(true)}
            style={btnDanger}
          >
            Supprimer mon compte
          </button>
        </div>

        {showConfirm && (
          <div style={confirmBox}>
            <p style={{ marginBottom: '10px' }}>⚠️ Cette action est irréversible.</p>
            <button onClick={handleDeleteAccount} style={{ ...btnDanger, marginRight: '10px' }}>
              Oui, supprimer
            </button>
            <button onClick={() => setShowConfirm(false)} style={btnPrimary}>
              Annuler
            </button>
          </div>
        )}

        {message && <p style={{ marginTop: '20px', textAlign: 'center', color: 'green' }}>{message}</p>}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '6px',
  marginBottom: '12px',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const sectionStyle = {
  marginBottom: '30px',
};

const labelStyle = {
  fontWeight: 'bold',
};

const btnPrimary = {
  padding: '10px 20px',
  backgroundColor: '#007BFF',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const btnDanger = {
  padding: '10px 20px',
  backgroundColor: 'tomato',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const confirmBox = {
  marginTop: '20px',
  padding: '20px',
  background: '#f8d7da',
  border: '1px solid #f5c6cb',
  borderRadius: '6px',
  textAlign: 'center',
};
