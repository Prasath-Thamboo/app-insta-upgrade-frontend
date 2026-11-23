import { useEffect, useState } from 'react';
import axios from 'axios';
import { StatusScreen } from '../components/PageLayout';

export default function InstagramCallback() {
  const [msg, setMsg] = useState('Connexion en cours…');
  const [state, setState] = useState('loading'); // loading | success | error | select
  const [pages, setPages] = useState(null); // si l’utilisateur a plusieurs Pages FB
  const [selectError, setSelectError] = useState('');

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const oauthState = params.get('state');
      const savedState = localStorage.getItem('ig_oauth_state');
      const token = localStorage.getItem('token');

      if (!code) { setMsg('Code OAuth manquant.'); setState('error'); return; }
      if (!oauthState || oauthState !== savedState) { setMsg('Échec vérification CSRF.'); setState('error'); return; }

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/instagram/exchange-code`,
          { code },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data?.needPageSelection && data?.pages?.length) {
          setPages(data.pages);
          setMsg('Sélectionnez la Page liée à votre compte Instagram');
          setState('select');
          return;
        }

        setMsg('Compte Instagram connecté !');
        setState('success');
        setTimeout(() => (window.location.href = '/dashboard'), 1000);
      } catch (e) {
        console.error(e?.response?.data || e.message);
        setMsg(e?.response?.data?.message || 'Erreur lors de la connexion Instagram.');
        setState('error');
      } finally {
        localStorage.removeItem('ig_oauth_state');
      }
    })();
  }, []);

  const selectPage = async (pageId) => {
    try {
      setSelectError('');
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/instagram/select-page`,
        { pageId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg('Page sélectionnée !');
      setState('success');
      setPages(null);
      setTimeout(() => (window.location.href = '/dashboard'), 800);
    } catch (e) {
      console.error(e?.response?.data || e.message);
      setSelectError(e?.response?.data?.message || 'Erreur de sélection de page.');
    }
  };

  const icon = { loading: <span className="spinner" />, success: '✓', error: '!', select: '📄' }[state];
  const tone = { loading: 'brand', success: 'success', error: 'error', select: 'brand' }[state];

  return (
    <StatusScreen
      icon={icon}
      tone={tone}
      title={msg}
      actions={state === 'error' ? <a href="/connect-instagram" className="btn btn--primary">Réessayer</a> : null}
    >
      {state === 'success' && <p>Redirection vers votre compteur…</p>}
      {selectError && <div className="alert alert--error">{selectError}</div>}
      {pages && (
        <div className="choice-grid" style={{ marginTop: 16 }}>
          {pages.map((p) => (
            <button key={p.id} type="button" className="choice" onClick={() => selectPage(p.id)}>
              <span className="choice__icon">📄</span>
              <span><strong>{p.name}</strong></span>
            </button>
          ))}
        </div>
      )}
    </StatusScreen>
  );
}
