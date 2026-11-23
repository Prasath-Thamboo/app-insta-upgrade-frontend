import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [instagramToken, setInstagramToken] = useState('');
  const [message, setMessage] = useState(null); // { type, text }

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const user = res.data.find((u) => u._id === id);
        if (!user) return setMessage({ type: 'error', text: 'Utilisateur introuvable' });
        setEmail(user.email);
        setUsername(user.username);
        setInstagramToken(user.instagramToken || '');
      })
      .catch(() => setMessage({ type: 'error', text: 'Erreur de chargement' }));
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, { email, username }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}/token`, {
        instagramToken: instagramToken.trim() === '' ? null : instagramToken.trim(),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: 'success', text: 'Mise à jour réussie' });
      setTimeout(() => navigate('/admin'), 1000);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
    }
  };

  return (
    <PageLayout narrow back={{ to: '/admin', label: 'Retour au panneau admin' }}>
      <div className="page__head">
        <h1>Modifier l’utilisateur</h1>
        <p>{username || email}</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="form">
          {message && <div className={`alert alert--${message.type}`} role="status">{message.text}</div>}

          <div className="field">
            <label className="field__label" htmlFor="email">Email</label>
            <input id="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="username">Nom d’utilisateur</label>
            <input id="username" className="input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="token">Token Instagram</label>
            <div className="input-group">
              <input id="token" className="input" type="text" value={instagramToken}
                onChange={(e) => setInstagramToken(e.target.value)} placeholder="Laisser vide pour supprimer" />
              {instagramToken && (
                <button type="button" className="input-group__btn" onClick={() => setInstagramToken('')}>Effacer</button>
              )}
            </div>
          </div>

          <div className="row">
            <button type="submit" className="btn btn--primary">Enregistrer les modifications</button>
            <button type="button" className="btn btn--ghost" onClick={() => navigate('/admin')}>Annuler</button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
