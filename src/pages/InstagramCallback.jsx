// src/pages/InstagramCallback.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function InstagramCallback() {
  const [msg, setMsg] = useState('Connexion en cours…');
  const [pages, setPages] = useState(null); // si l’utilisateur a plusieurs Pages FB

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const savedState = localStorage.getItem('ig_oauth_state');
      const token = localStorage.getItem('token');

      if (!code) { setMsg('Code OAuth manquant.'); return; }
      if (!state || state !== savedState) { setMsg('Échec vérification CSRF.'); return; }

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/instagram/exchange-code`,
          { code },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data?.needPageSelection && data?.pages?.length) {
          // L’utilisateur gère plusieurs Pages : on lui propose de choisir
          setPages(data.pages);
          setMsg('Sélectionnez la Page liée à votre compte Instagram :');
          return;
        }

        setMsg('Compte Instagram connecté ✅. Redirection…');
        setTimeout(() => (window.location.href = '/dashboard'), 1000);
      } catch (e) {
        console.error(e?.response?.data || e.message);
        setMsg(e?.response?.data?.message || 'Erreur lors de la connexion Instagram.');
      } finally {
        localStorage.removeItem('ig_oauth_state');
      }
    })();
  }, []);

  const selectPage = async (pageId) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/instagram/select-page`,
        { pageId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg('Page sélectionnée ✅. Redirection…');
      setTimeout(() => (window.location.href = '/dashboard'), 800);
    } catch (e) {
      console.error(e?.response?.data || e.message);
      alert(e?.response?.data?.message || 'Erreur de sélection de page.');
    }
  };

  return (
    <div className="body-sim">
      <div className="container" style={{ maxWidth: 520 }}>
        <h2>{msg}</h2>
        {pages && (
          <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
            {pages.map(p => (
              <button key={p.id} onClick={() => selectPage(p.id)} style={{ padding: 10, borderRadius: 8 }}>
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
