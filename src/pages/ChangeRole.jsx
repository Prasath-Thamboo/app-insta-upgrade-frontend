import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageLayout from '../components/PageLayout';

const ROLES = [
  { id: 'user', label: 'Utilisateur', desc: 'Abonné Premium, accès complet.', icon: '⭐' },
  { id: 'testeur', label: 'Testeur', desc: 'Essai gratuit en cours.', icon: '🧪' },
  { id: 'freeuser', label: 'Utilisateur gratuit', desc: 'Inscrit, sans abonnement.', icon: '👤' },
  { id: 'admin', label: 'Administrateur', desc: 'Accès au panneau admin.', icon: '🛠️' },
];

export default function ChangeRole() {
  const { id } = useParams();
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      const user = res.data.find((u) => u._id === id);
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
      navigate('/admin');
    } catch {
      setError('Erreur lors du changement de rôle');
    }
  };

  return (
    <PageLayout narrow back={{ to: '/admin', label: 'Retour au panneau admin' }}>
      <div className="page__head">
        <h1>Modifier le rôle</h1>
        <p>Utilisateur : <strong>{username}</strong></p>
      </div>

      <form onSubmit={handleChange} className="card form">
        {error && <div className="alert alert--error" role="alert">{error}</div>}
        <div className="choice-grid" role="radiogroup" aria-label="Rôle">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={role === r.id}
              className="choice"
              style={role === r.id ? { borderColor: 'var(--brand)', boxShadow: 'var(--ring)' } : undefined}
              onClick={() => setRole(r.id)}
            >
              <span className="choice__icon">{r.icon}</span>
              <span><strong>{r.label}</strong><small>{r.desc}</small></span>
            </button>
          ))}
        </div>
        <div className="row">
          <button type="submit" className="btn btn--primary">Enregistrer le rôle</button>
          <button type="button" className="btn btn--ghost" onClick={() => navigate('/admin')}>Annuler</button>
        </div>
      </form>
    </PageLayout>
  );
}
