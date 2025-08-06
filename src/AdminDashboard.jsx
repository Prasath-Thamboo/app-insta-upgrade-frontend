import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
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
                    onClick={() => setConfirmDeleteId(u._id)}
                    className={deleteBtnStyle}
                    style={{ backgroundColor: 'var(--negatif)' }}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {confirmDeleteId && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <p style={{color:'var(--simple-color)'}}>⚠️ Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button
                onClick={() => {
                  deleteUser(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                style={{ ...modalButton, backgroundColor: 'var(--negatif)' }}
              >
                Oui, supprimer
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                style={{ ...modalButton, backgroundColor: 'var(--main-color)', color: 'var(--simple-color2)' }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

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
  color: 'white',
  cursor: 'pointer',
  fontSize: '14px',
};

const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000,
};

const modalBox = {
  background: '#fff',
  padding: '30px',
  borderRadius: '10px',
  width: '90%',
  maxWidth: '400px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  textAlign: 'center',
};

const modalButton = {
  padding: '10px 20px',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const deleteBtnStyle = {
  backgroundColor: 'red',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
};


