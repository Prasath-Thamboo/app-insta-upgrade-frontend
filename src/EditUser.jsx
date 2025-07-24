// EditUser.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditUser() {
  const { id } = useParams();
  const [user, setUser] = useState({ email: '', username: '', instaEmail: '' });
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const target = res.data.find((u) => u._id === id);
        if (target) setUser(target);
      })
      .catch(() => navigate('/admin'));
  }, [id, navigate, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/admin/users/${id}`, user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/admin');
    } catch {
      alert('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="body-sim2">
      <h2>Modifier l’utilisateur</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="Email" required />
        <input type="text" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} placeholder="Nom d'utilisateur" required />
        <input type="email" value={user.instaEmail} onChange={(e) => setUser({ ...user, instaEmail: e.target.value })} placeholder="Email Instagram" />
        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
}
