// Profile.jsx
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
      console.error(err);
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
      console.error(err);
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
      console.error(err);
      setMessage("Erreur lors de la suppression du compte");
    }
  };

  return (
    <div className="body-sim" style={{ flexDirection: 'column' }}>
      <h1 style={{ marginTop: '60px', textAlign: 'center' }}>Mon compte</h1>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Link to="/dashboard">
          <button style={{ padding: '8px 16px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px' }}>
            ← Retour au dashboard
          </button>
        </Link>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px' }}>Bienvenue, <span style={{ color: '#007BFF' }}>{username}</span></h2>
        </div>

        <form onSubmit={handleUsernameChange} style={{ marginBottom: '30px' }}>
          <label>Modifier le nom d’utilisateur :</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ marginTop: '10px', padding: '10px 20px' }}>Enregistrer</button>
        </form>

        <form onSubmit={handlePasswordChange} style={{ marginBottom: '30px' }}>
          <label>Modifier le mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', marginTop: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ marginTop: '10px', padding: '10px 20px' }}>Enregistrer</button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <p>Statut : <strong>{tokenSet ? '✅ Actif' : '❌ Inactif'}</strong></p>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <button
            onClick={() => setShowConfirm(true)}
            style={{ padding: '10px 20px', backgroundColor: 'tomato', color: 'white', border: 'none', borderRadius: '5px' }}>
            Supprimer mon compte
          </button>
        </div>

        {showConfirm && (
          <div style={{ marginTop: '20px', padding: '20px', background: 'linear-gradient(135deg, #ff7a18, #af002d, #5f4b8b)', borderRadius: '8px', textAlign: 'center' }}>
            <p><strong>⚠️ Cette action est irréversible. Voulez-vous vraiment supprimer votre compte ?</strong></p>
            <button onClick={handleDeleteAccount} style={{ margin: '10px', padding: '8px 16px', background: 'red', color: 'white' }}>Oui, supprimer</button>
            <button onClick={() => setShowConfirm(false)} style={{ margin: '10px', padding: '8px 16px' }}>Annuler</button>
          </div>
        )}

        {message && <p style={{ marginTop: '30px', textAlign: 'center', color: 'green' }}>{message}</p>}
      </div>
    </div>
  );
}
