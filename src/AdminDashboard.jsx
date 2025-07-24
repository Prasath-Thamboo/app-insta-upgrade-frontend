// AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setMessage('Accès refusé ou erreur serveur');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    try {
      await axios.delete(`http://localhost:3001/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      setMessage('Erreur lors de la suppression');
    }
  };

  return (
    <div className="body-sim2">
      <h1>Panneau Admin - Utilisateurs</h1>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <table style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => navigate(`/admin/edit/${u._id}`)}>Modifier</button>
                <button onClick={() => navigate(`/admin/role/${u._id}`)}>Changer rôle</button>
                <button onClick={() => deleteUser(u._id)} style={{ color: 'red' }}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
