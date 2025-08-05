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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      setMessage('Erreur lors de la suppression');
    }
  };

  return (
    <div className="body-sim2" style={{ padding: '40px' }}>
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          marginBottom: '30px',
          padding: '10px 20px',
          backgroundColor: 'var(--main-color)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        ← Retour au Dashboard
      </button>

      <h1 style={{ marginBottom: '20px' }}>Panneau Admin - Utilisateurs</h1>
      {message && <p style={{ color: 'red', marginBottom: '15px' }}>{message}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--main-color)', borderRadius:'20px' }}>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Username</th>
            <th style={thStyle}>Rôle</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={tdStyle}>{u.email}</td>
              <td style={tdStyle}>{u.username}</td>
              <td style={tdStyle}>{u.role}</td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => navigate(`/admin/edit/${u._id}`)}
                    style={actionBtnStyle}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => navigate(`/admin/role/${u._id}`)}
                    style={{ ...actionBtnStyle, backgroundColor: '#ffc107' }}
                  >
                    Changer rôle
                  </button>
                  <button
                    onClick={() => navigate(`/admin/edit/${u._id}`)}
                    style={{ ...actionBtnStyle, backgroundColor: '#17a2b8' }}
                  >
                    Token
                  </button>
                  <button
                    onClick={() => deleteUser(u._id)}
                    style={{ ...actionBtnStyle, backgroundColor: 'tomato' }}
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '12px',
  fontWeight: 'bold',
  borderBottom: '2px solid var(--simple-color)',
};

const tdStyle = {
  padding: '10px',
  verticalAlign: 'middle',
  color: 'var(--simple-color)'
};

const actionBtnStyle = {
  padding: '6px 10px',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: '#007bff',
  color: 'white',
  cursor: 'pointer',
  fontSize: '14px',
};
