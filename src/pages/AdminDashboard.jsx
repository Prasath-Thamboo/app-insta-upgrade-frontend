import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/AdminDashboard.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (err) {
      setMessage('Accès refusé ou erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setMessage('Erreur lors de la suppression');
    }
  };

  return (
    <main className="admin-page">
      <section className="admin">
        {/* Toolbar */}
        <header className="admin__toolbar">
          <button
            type="button"
            className="btn btn--primary btn--pill"
            onClick={() => navigate('/dashboard')}
          >
            ← Retour au Dashboard
          </button>

          <div className="admin__title">
            <h1 className="admin__heading">Panneau Admin — Utilisateurs</h1>
            {message && (
              <p className="admin__msg" role="status" aria-live="polite">
                {message}
              </p>
            )}
          </div>

          <div className="admin__actions">
            <button
              type="button"
              className="btn"
              onClick={fetchUsers}
              aria-busy={loading ? 'true' : 'false'}
              disabled={loading}
              title="Rafraîchir la liste"
            >
              {loading ? 'Rafraîchissement…' : 'Rafraîchir'}
            </button>
          </div>
        </header>

        {/* Mobile: Cards */}
        <ul className="user-cards" aria-label="Liste des utilisateurs (mobile)">
          {users.map((u) => (
            <li className="user-card" key={u._id}>
              <div className="user-card__row">
                <span className="user-card__label">Email</span>
                <span className="user-card__value">{u.email}</span>
              </div>
              <div className="user-card__row">
                <span className="user-card__label">Username</span>
                <span className="user-card__value">{u.username}</span>
              </div>
              <div className="user-card__row">
                <span className="user-card__label">Rôle</span>
                <span className="user-card__value">{u.role}</span>
              </div>
              <div className="user-card__actions">
                <button
                  type="button"
                  className="btn btn--sm"
                  onClick={() => navigate(`/admin/edit/${u._id}`)}
                >
                  Modifier
                </button>
                <button
                  type="button"
                  className="btn btn--warn btn--sm"
                  onClick={() => navigate(`/admin/role/${u._id}`)}
                >
                  Changer rôle
                </button>
                <button
                  type="button"
                  className="btn btn--info btn--sm"
                  onClick={() => navigate(`/admin/edit/${u._id}`)}
                >
                  Token
                </button>
                <button
                  type="button"
                  className="btn btn--danger btn--sm"
                  onClick={() => setConfirmDeleteId(u._id)}
                >
                  🗑️ Supprimer
                </button>
              </div>
            </li>
          ))}
          {users.length === 0 && !loading && (
            <li className="user-cards__empty">Aucun utilisateur.</li>
          )}
        </ul>

        {/* Desktop: Table */}
        <div className="table-wrap" role="region" aria-label="Table des utilisateurs" tabIndex={0}>
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Username</th>
                <th>Rôle</th>
                <th className="table__th--actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.email}</td>
                  <td>{u.username}</td>
                  <td>{u.role}</td>
                  <td>
                    <div className="table__actions">
                      <button
                        type="button"
                        className="btn btn--sm"
                        onClick={() => navigate(`/admin/edit/${u._id}`)}
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        className="btn btn--warn btn--sm"
                        onClick={() => navigate(`/admin/role/${u._id}`)}
                      >
                        Changer rôle
                      </button>
                      <button
                        type="button"
                        className="btn btn--info btn--sm"
                        onClick={() => navigate(`/admin/edit/${u._id}`)}
                      >
                        Token
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        onClick={() => setConfirmDeleteId(u._id)}
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="table__empty">Aucun utilisateur.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal confirmation */}
        {confirmDeleteId && (
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <div className="modal__box">
              <h2 id="confirm-title" className="modal__title">Confirmer la suppression</h2>
              <p className="modal__text">⚠️ Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
              <div className="modal__actions">
                <button
                  type="button"
                  className="btn btn--danger"
                  onClick={() => {
                    deleteUser(confirmDeleteId);
                    setConfirmDeleteId(null);
                  }}
                >
                  Oui, supprimer
                </button>
                <button
                  type="button"
                  className="btn btn--primary btn--ghost"
                  onClick={() => setConfirmDeleteId(null)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
