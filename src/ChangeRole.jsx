// ChangeRole.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ChangeRole() {
  const { id } = useParams();
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const user = res.data.find(u => u._id === id);
      if (user) {
        setRole(user.role);
        setUsername(user.username || user.email);
      }
    });
  }, [id, token]);

  const handleChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}/role`, { role }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Rôle mis à jour avec succès.');
      navigate('/admin');
    } catch {
      alert('❌ Erreur lors du changement de rôle');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--simple-color2)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>
          Modifier le rôle de <span style={{ color: 'var(--main-color)' }}>{username}</span>
        </h1>
        <form onSubmit={handleChange}>
          <label style={{ fontWeight: 'bold' }}>Nouveau rôle :</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '10px',
              marginBottom: '20px',
              borderRadius: '6px',
              border: '1px solid #ccc'
            }}
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
            <option value="freeuser">Free Utilisateur</option>
            <option value="testeur">Testeur</option>

          </select>
          <button type="submit" style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            ✅ Valider
          </button>
        </form>
      </div>
    </div>
  );
}
