// EditUser.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [instaEmail, setInstaEmail] = useState('');
  const [instagramToken, setInstagramToken] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3001/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      const user = res.data.find((u) => u._id === id);
      if (!user) return setMessage('Utilisateur introuvable');
      setEmail(user.email);
      setUsername(user.username);
      setInstaEmail(user.instaEmail || '');
      setInstagramToken(user.instagramToken || '');
    })
    .catch(() => setMessage('Erreur de chargement'));
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Mettre à jour les infos générales
      await axios.put(`http://localhost:3001/api/admin/users/${id}`, {
        email,
        username,
        instaEmail
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 2. Mettre à jour le token Instagram (peut être null)
      await axios.put(`http://localhost:3001/api/admin/users/${id}/token`, {
        instagramToken: instagramToken.trim() === '' ? null : instagramToken.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Mise à jour réussie');
      setTimeout(() => navigate('/admin'), 1000);
    } catch (err) {
      console.error(err);
      setMessage('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="body-sim2" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Modifier l'utilisateur</h1>

      {message && <p style={{ color: 'red' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label>Email :</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Nom d’utilisateur :</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label>Email Instagram :</label>
        <input type="email" value={instaEmail} onChange={(e) => setInstaEmail(e.target.value)} />

        <label>Token Instagram :</label>
        <input
          type="text"
          value={instagramToken}
          onChange={(e) => setInstagramToken(e.target.value)}
          placeholder="Laisser vide pour supprimer"
        />
        <button type="button" onClick={() => setInstagramToken('')} style={{ color: 'red' }}>
          Supprimer le token
        </button>

        <button type="submit" style={{ backgroundColor: '#007BFF', color: 'white' }}>
          Enregistrer les modifications
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <Link to="/admin">
          <button style={{ padding: '8px 16px' }}>← Retour au panneau admin</button>
        </Link>
      </div>
    </div>
  );
}
