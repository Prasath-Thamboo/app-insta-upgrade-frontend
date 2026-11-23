import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import '../css/AdminDashboard.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
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
    } catch {
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
    } catch {
      setMessage('Erreur lors de la suppression');
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.email, u.username, u.role].some((v) => (v || '').toLowerCase().includes(q))
    );
  }, [users, query]);

  const countBy = (role) => users.filter((u) => u.role === role).length;

  const Actions = ({ u }) => (
    <>
      <button type="button" className="btn btn--sm" onClick={() => navigate(`/admin/edit/${u._id}`)}>Modifier</button>
      <button type="button" className="btn btn--sm" onClick={() => navigate(`/admin/role/${u._id}`)}>Rôle</button>
      <button type="button" className="btn btn--sm btn--danger-soft" onClick={() => setConfirmDeleteId(u._id)}>Supprimer</button>
    </>
  );

  const RoleBadge = ({ role }) => <span className={`badge role role--${role}`}>{role}</span>;

  return (
    <PageLayout back={{ to: '/dashboard', label: 'Retour au compteur' }}>
      <header className="admin__toolbar">
        <div>
          <h1>Panneau d’administration</h1>
          <p>Gérez les utilisateurs, leurs rôles et leurs accès.</p>
        </div>
        <button type="button" className="btn" onClick={fetchUsers} disabled={loading} aria-busy={loading}>
          {loading ? 'Rafraîchissement…' : '↻ Rafraîchir'}
        </button>
      </header>

      {message && <div className="alert alert--error" role="status" style={{ marginBottom: 16 }}>{message}</div>}

      <div className="admin__stats">
        <div className="admin__stat"><strong>{users.length}</strong><span>Utilisateurs</span></div>
        <div className="admin__stat"><strong>{countBy('user')}</strong><span>Abonnés</span></div>
        <div className="admin__stat"><strong>{countBy('testeur')}</strong><span>En essai</span></div>
        <div className="admin__stat"><strong>{countBy('freeuser')}</strong><span>Gratuits</span></div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input
          className="input admin__search"
          type="search"
          placeholder="Rechercher un email, un nom, un rôle…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Rechercher un utilisateur"
        />
      </div>

      {/* Mobile : cartes */}
      <ul className="user-cards" aria-label="Liste des utilisateurs">
        {filtered.map((u) => (
          <li className="user-card" key={u._id}>
            <div className="user-card__head">
              <div><strong>{u.username}</strong><small>{u.email}</small></div>
              <RoleBadge role={u.role} />
            </div>
            <div className="user-card__actions"><Actions u={u} /></div>
          </li>
        ))}
        {filtered.length === 0 && !loading && <li className="user-cards__empty">Aucun utilisateur.</li>}
      </ul>

      {/* Desktop : table */}
      <div className="table-wrap" role="region" aria-label="Table des utilisateurs" tabIndex={0}>
        <table className="table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Rôle</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u._id}>
                <td><div className="table__user"><strong>{u.username}</strong><small>{u.email}</small></div></td>
                <td><RoleBadge role={u.role} /></td>
                <td><div className="table__actions"><Actions u={u} /></div></td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr><td colSpan="3" className="table__empty">Aucun utilisateur.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {confirmDeleteId && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal__box" onClick={(e) => e.stopPropagation()}>
            <div className="status-card__icon status-card__icon--error">!</div>
            <h2 id="confirm-title">Supprimer cet utilisateur ?</h2>
            <p className="muted">Cette action est définitive.</p>
            <div className="modal__actions">
              <button type="button" className="btn" onClick={() => setConfirmDeleteId(null)}>Annuler</button>
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => { deleteUser(confirmDeleteId); setConfirmDeleteId(null); }}
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
