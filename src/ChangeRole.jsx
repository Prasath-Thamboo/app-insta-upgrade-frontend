// ChangeRole.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ChangeRole() {
  const { id } = useParams();
  const [role, setRole] = useState('user');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const user = res.data.find(u => u._id === id);
      if (user) setRole(user.role);
    });
  }, [id, token]);

  const handleChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/admin/users/${id}/role`, { role }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/admin');
    } catch {
      alert('Erreur lors du changement de rôle');
    }
  };

  return (
    <div className="body-sim2">
      <h2>Changer le rôle</h2>
      <form onSubmit={handleChange}>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">Utilisateur</option>
          <option value="admin">Administrateur</option>
        </select>
        <button type="submit">Valider</button>
      </form>
    </div>
  );
}
